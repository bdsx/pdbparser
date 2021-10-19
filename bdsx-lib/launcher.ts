import asmcode = require("./asm/asmcode");
import { asm, Register } from "./assembler";
import { Dimension } from "./bds/dimension";
import { capi } from "./capi";
import { command } from "./command";
import { CANCEL, Encoding } from "./common";
import { bedrock_server_exe, cgate, ipfilter, jshook, MultiThreadQueue, StaticPointer, uv_async } from "./core";
import { dll } from "./dll";
import { GetLine } from "./getline";
import { hook } from "./hook";
import { makefunc } from "./makefunc";
import { mcglobal } from "./mcglobal";
import "./minecraft_impl";
import { CxxString, int32_t, int64_as_float_t, NativeType, void_t } from "./nativetype";
import { CxxStringWrapper } from "./pointer";
import { remapAndPrintError, remapError } from "./source-map-support";
import { MemoryUnlocker } from "./unlocker";
import { DeferPromise, _tickCallback } from "./util";
import { bdsx } from "./v3";

import colors = require('colors');
import minecraft = require("./minecraft");

class Liner {
    private remaining = '';
    write(str:string):string|null {
        const lastidx = str.lastIndexOf('\n');
        if (lastidx === -1) {
            this.remaining += str;
            return null;
        } else {
            const out = this.remaining + str.substr(0, lastidx);
            this.remaining = str.substr(lastidx + 1);
            return out;
        }
    }
}

let launched = false;
const loadingIsFired = DeferPromise.make<void>();
const openIsFired = DeferPromise.make<void>();

const bedrockLogLiner = new Liner;
const cmdOutputLiner = new Liner;

const commandQueue = new MultiThreadQueue(CxxString[NativeType.size]);
const commandQueueBuffer = new CxxStringWrapper(true);

function patchForStdio():void {
    // hook bedrock log
    asmcode.bedrockLogNp = makefunc.np((severity, msgptr, size)=>{
        // void(*callback)(int severity, const char* msg, size_t size)
        let line = bedrockLogLiner.write(msgptr.getString(size, 0, Encoding.Utf8));
        if (line === null) return;

        let color:colors.Color;
        switch (severity) {
        case 1:
            color = colors.white;
            break;
        case 2:
            color = colors.brightWhite;
            break;
        case 4:
            color = colors.brightYellow;
            break;
        default:
            color = colors.brightRed;
            break;
        }
        if (bdsx.events.serverLog.fire(line, color) === CANCEL) return;
        line = color(line);
        console.log(line);
    }, void_t, {onError:asmcode.jsend_returnZero}, int32_t, StaticPointer, int64_as_float_t);
    //  asmcode.bedrockLogNp = asmcode.jsend_returnZero;
    hook(minecraft.BedrockLogOut).write(asm().jmp64(asmcode.logHook, Register.rax), null, null, 'hook-bedrock-log');

    asmcode.CommandOutputSenderHookCallback = makefunc.np((bytes, ptr)=>{
        // void(*callback)(const char* log, size_t size)
        const line = cmdOutputLiner.write(ptr.getString(bytes));
        if (line === null) return;
        if (bdsx.events.commandOutput.fire(line) !== CANCEL) {
            console.log(line);
        }
    }, void_t, {onError: asmcode.jsend_returnZero}, int64_as_float_t, StaticPointer);
    hook(minecraft.CommandOutputSender, 'send').patch(asmcode.CommandOutputSenderHook, Register.rax, true, [
        0xE8, 0xFF, 0xFF, 0xFF, 0xFF,               // call <bedrock_server.class std::basic_ostream<char,struct std::char_traits<char> > & __ptr64 __cdecl std::_Insert_string<char,struct std::char_traits<char>,unsigned __int64>(class std::basic_ostream<char,struct std::char_traits<char> > & __ptr64,char const * __ptr64 const,uns>
        0x48, 0x8D, 0x15, 0xFF, 0xFF, 0xFF, 0xFF,   // lea rdx,qword ptr ds:[<class std::basic_ostream<char,struct std::char_traits<char> > & __ptr64 __cdecl std::flush<char,struct std::char_traits<char> >(class std::basic_ostream<char,struct std::char_traits<char> > & __ptr64)>]
        0x48, 0x8B, 0xC8,                           // mov rcx,rax
        0xFF, 0x15, 0xFF, 0xFF, 0xFF, 0xFF,         // call qword ptr ds:[<&??5?$basic_istream@DU?$char_traits@D@std@@@std@@QEAAAEAV01@P6AAEAV01@AEAV01@@Z@Z>]
    ], 0x217, 'hook-command-output', [1, 5, 8, 12, 17, 21]);


    // hook stdin
    asmcode.commandQueue = commandQueue;
    asmcode.MultiThreadQueueTryDequeue = MultiThreadQueue.tryDequeue;
    hook(minecraft.ConsoleInputReader, 'getLine').patch(asmcode.ConsoleInputReader_getLine_hook, Register.rax, false, [
        0xE9, 0x3B, 0xF6, 0xFF, 0xFF,  // jmp SPSCQueue::tryDequeue
        0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC // int3 ...
    ], null, 'hook-stdin-command', [3, 7, 21, 25, 38, 42]);

    // remove original stdin thread
    const justReturn = asm().ret().buffer();
    hook(minecraft.ConsoleInputReader, NativeType.ctor).write(justReturn);
    hook(minecraft.ConsoleInputReader, NativeType.dtor).write(justReturn);
    hook(minecraft.ConsoleInputReader, 'unblockReading').write(justReturn);
}

function _launch(asyncResolve:()=>void):void {
    ipfilter.init(ip=>{
        console.error(`[BDSX] traffic exceeded threshold for IP: ${ip}`);
    });
    jshook.init();

    asmcode.evWaitGameThreadEnd = dll.kernel32.CreateEventW(null, 0, 0, null);

    uv_async.open();

    // uv async callback, when BDS closed perfectly
    function finishCallback():void {
        uv_async.close();
        threadHandle.close();
        bdsx.events.serverClose.fire();
        bdsx.events.serverClose.clear();
        _tickCallback();
    }

    // // call game thread entry
    asmcode.gameThreadInner = minecraft.lambda_8914ed82e3ef519cb2a85824fbe333d8.operator_call;
    asmcode.free = dll.ucrtbase.free.pointer;
    asmcode.SetEvent = dll.kernel32.SetEvent.pointer;

    // hook game thread
    asmcode.WaitForSingleObject = dll.kernel32.WaitForSingleObject.pointer;
    asmcode._Cnd_do_broadcast_at_thread_exit = dll.msvcp140._Cnd_do_broadcast_at_thread_exit;

    // 'std::thread::_Invoke<std::tuple<<lambda_8914ed82e3ef519cb2a85824fbe333d8> >,0>'
    const invoke = minecraft.std.thread._Invoke(minecraft.std.tuple.make([minecraft.lambda_8914ed82e3ef519cb2a85824fbe333d8, 0]));
    hook(invoke).patch(
        asmcode.gameThreadHook, // original depended
        Register.rax, true, [
            0x48, 0x8B, 0xD9, // mov rbx,rcx
            0xE8, 0xFF, 0xFF, 0xFF, 0xFF, // call <bedrock_server.<lambda_8914ed82e3ef519cb2a85824fbe333d8>::operator()>
            0xE8, 0xFF, 0xFF, 0xFF, 0xFF, // call <bedrock_server._Cnd_do_broadcast_at_thread_exit>
        ], 6, 'hook-game-thread', [4, 8, 9, 13]
    );
    // get server instance
    hook(minecraft.ServerInstance, NativeType.ctor).raw(asmcode.ServerInstance_ctor_hook, {callOriginal: true});

    // it removes errors when run commands on shutdown.
    hook(minecraft.ScriptEngine, NativeType.dtor).writeNop([
        0x48, 0x8D, 0x4B, 0x78,      // lea rcx,qword ptr ds:[rbx+78]
        0xE8, 0x6A, 0xF5, 0xFF, 0xFF // call <bedrock_server.public: __cdecl std::deque<struct ScriptCommand,class std::allocator<struct ScriptCommand> >::~deque<struct ScriptCommand,class std::allocator<struct ScriptCommand> >(void) __ptr64>
    ], 0x7d, 'skip-command-list-destruction', [5, 9]);

    // enable script
    hook(minecraft.MinecraftServerScriptEngine, 'onServerThreadStarted').writeNop([
        0xE8, 0xFF, 0xFF, 0xFF, 0xFF,       // call <bedrock_server.public: static bool __cdecl ScriptEngine::isScriptingEnabled(void)>
        0x84, 0xC0,                         // test al,al
        0x0F, 0x84, 0xFF, 0xFF, 0xFF, 0xFF, // je bedrock_server.7FF7345226F3
        0x48, 0x8B, 0x13,                   // mov rdx,qword ptr ds:[rbx]                                                                                                                                                                                                                                                                          | rdx:&"졧\\직\x7F", rbx:L"뛠펇ǳ"
        0x48, 0x8B, 0xCB,                   // mov rcx,rbx                                                                                                                                                                                                                                                                                         | rbx:L"뛠펇ǳ"
        0xFF, 0x92, 0x88, 0x04, 0x00, 0x00, // call qword ptr ds:[rdx+488]
        0x48, 0x8B, 0xC8,                   // mov rcx,rax
        0xE8, 0xff, 0xff, 0xff, 0xff,       // call <bedrock_server.public: class Experiments & __ptr64 __cdecl LevelData::getExperiments(void) __ptr64>
        0x48, 0x8B, 0xC8,                   // mov rcx,rax
        0xE8, 0xFF, 0xFF, 0xFF, 0xFF,       // call <bedrock_server.public: bool __cdecl Experiments::Scripting(void)const __ptr64>
        0x84, 0xC0,                         // test al,al
        0x0F, 0x84, 0x06, 0x01, 0x00, 0x00, //je bedrock_server.7FF7C1CE94EF
    ], 0x38, 'force-enable-script', [1, 5, 9, 13, 16, 20, 29, 33, 37, 41]);

    patchForStdio();

    // seh wrapped main
    asmcode.bedrock_server_exe_args = bedrock_server_exe.args;
    asmcode.bedrock_server_exe_argc = bedrock_server_exe.argc;
    asmcode.bedrock_server_exe_main = bedrock_server_exe.main;
    asmcode.finishCallback = makefunc.np(finishCallback, void_t, null);

    {
        // restore main
        const unlock = new MemoryUnlocker(bedrock_server_exe.main, 12);
        bedrock_server_exe.main.add().copyFrom(bedrock_server_exe.mainOriginal12Bytes, 12);
        unlock.done();
    }

    // call main as a new thread
    // main will create a game thread.
    // and bdsx will hijack the game thread and run it on the node thread.
    const [threadHandle] = capi.createThread(asmcode.wrapped_main, null);

    require('./bds/implements');
    require('./event_impl');

    loadingIsFired.resolve();
    bdsx.events.serverLoading.fire();
    bdsx.events.serverLoading.clear();

    // skip to create the console of BDS
    hook(minecraft.ScriptApi.ScriptFramework, 'registerConsole').write(asm().mov_r_c(Register.rax, 1).ret());

    // hook on update
    asmcode.cgateNodeLoop = cgate.nodeLoop;
    asmcode.updateEvTargetFire = makefunc.np(()=>bdsx.events.serverUpdate.fire(), void_t, null);

    hook(minecraft.lambda_8914ed82e3ef519cb2a85824fbe333d8.operator_call).patch(
        asmcode.updateWithSleep, Register.rcx, true, [
            0xE8, 0xFF, 0xFF, 0xFF, 0xFF,  // call <bedrock_server._Query_perf_frequency>
            0x48, 0x8B, 0xD8,  // mov rbx,rax
            0xE8, 0xFF, 0xFF, 0xFF, 0xFF,  // call <bedrock_server._Query_perf_counter>
            0x48, 0x99,  // cqo
            0x48, 0xF7, 0xFB,  // idiv rbx
            0x48, 0x69, 0xC8, 0x00, 0xCA, 0x9A, 0x3B,  // imul rcx,rax,3B9ACA00
            0x48, 0x69, 0xC2, 0x00, 0xCA, 0x9A, 0x3B,  // imul rax,rdx,3B9ACA00
            0x48, 0x99,  // cqo
            0x48, 0xF7, 0xFB,  // idiv rbx
            0x48, 0x03, 0xC8,  // add rcx,rax
            0x48, 0x8B, 0x44, 0x24, 0x20,  // mov rax,qword ptr ss:[rsp+20]
            0x48, 0x2B, 0xC1,  // sub rax,rcx
            0x48, 0x3D, 0x88, 0x13, 0x00, 0x00,  // cmp rax,1388
            0x7C, 0x0B,  // jl bedrock_server.7FF733FDEE76
            0x48, 0x8D, 0x4C, 0x24, 0x20,  // lea rcx,qword ptr ss:[rsp+20]
            0xE8, 0xFF, 0xFF, 0xFF, 0xFF,  // call <bedrock_server.void __cdecl std::this_thread::sleep_until<struct std::chrono::steady_clock,class std::chrono::duration<__int64,struct std::ratio<1,1000000000> > >(class std::chrono::time_point<struct std::chrono::steady_clock,class std::chrono::duration<__int64,struct s>
            0x90,  // nop
        ], 0x5f3, 'update-hook', [1, 5, 9, 13, 62, 66]
    );
    // hook on script starting
    hook(minecraft.ScriptEngine, 'startScriptLoading').call(function(){
        try {
            cgate.nodeLoopOnce();

            mcglobal.init();

            openIsFired.resolve();
            bdsx.events.serverOpen.fire();
            bdsx.events.serverOpen.clear(); // it will never fire, clear it
            asyncResolve();
            _tickCallback();

            this._processSystemInitialize();
            _tickCallback();
            cgate.nodeLoopOnce();
        } catch (err) {
            bdsx.events.errorFire(err);
            remapAndPrintError(err);
        }
    }, {callOriginal: true, noOriginal:true});

    hook(minecraft.ScriptEngine, 'shutdown').call(()=>{
        try {
            bdsx.events.serverStop.fire();
        } catch (err) {
            remapAndPrintError(err);
        }
    }, {callOriginal: true, noOriginal: true});

    // keep ScriptEngine variables. idk why it needs.
    hook(minecraft.MinecraftServerScriptEngine, 'onServerUpdateEnd').write(asm().ret());
}

const deleteServerCommandOrigin = makefunc.js([0, 0], void_t, {this:minecraft.ServerCommandOrigin}, int32_t);
minecraft.ServerCommandOrigin[NativeType.dtor] = ()=>deleteServerCommandOrigin.call(this, 1);

function sessionIdGrabber(text: string): void {
    const tmp = text.match(/\[\d{4}-\d\d-\d\d \d\d:\d\d:\d\d INFO\] Session ID (.*)$/);
    if(tmp) {
        bedrockServer.sessionId = tmp[1];
        bdsx.events.serverLog.remove(sessionIdGrabber);
    }
}
bdsx.events.serverLog.on(sessionIdGrabber);

export namespace bedrockServer
{
    export let sessionId: string;

    export function withLoading():Promise<void> {
        return loadingIsFired;
    }
    export function afterOpen():Promise<void> {
        return openIsFired;
    }
    export function isLaunched():boolean {
        return launched;
    }

    /**
     * stop the BDS
     * It will stop next tick
     */
    export function stop():void {
        const server = mcglobal.serverInstance.server;
        server.addAs(minecraft.DedicatedServer, 8).stop();
    }

    export function forceKill(exitCode:number):never {
        bedrock_server_exe.forceKill(exitCode);
    }

    export function launch():Promise<void> {
        return new Promise((resolve, reject)=>{
            if (launched) {
                reject(remapError(Error('Cannot launch BDS again')));
                return;
            }
            launched = true;
            _launch(resolve);
        });
    }

    /**
     * pass to stdin
     * recommend using command.execute instead
     * It exists in anticipation of other unexpected effects.
     */
    export function executeCommandOnConsole(command:string):void {
        commandQueueBuffer.construct();
        commandQueueBuffer.value = command;
        commandQueue.enqueue(commandQueueBuffer); // assumes the string is moved, and does not have the buffer anymore.
    }

    /**
     * @deprecated use 'command.execute' in 'bdsx/command'
     */
    export function executeCommand(commandstr:string, mute?:boolean, permissionLevel?:number, dimension?:Dimension|null):minecraft.MCRESULT {
        return command.execute(commandstr, mute, permissionLevel, dimension);
    }

    let stdInHandler:DefaultStdInHandler|null = null;

    export class DefaultStdInHandler {
        protected online:(line:string)=>void = executeCommandOnConsole;
        private readonly getline = new GetLine(line=>this.online(line));
        protected readonly onclose = ():void=>{
            this.close();
        };

        constructor() {
            bdsx.events.serverClose.on(this.onclose);
        }

        static install():DefaultStdInHandler {
            if (stdInHandler !== null) throw remapError(Error('Already opened'));
            return stdInHandler = new DefaultStdInHandler;
        }

        close():void {
            if (stdInHandler === null) return;
            console.assert(stdInHandler !== null);
            stdInHandler = null;
            this.getline.close();
        }
    }
}
