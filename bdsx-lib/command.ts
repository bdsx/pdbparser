
import { Command, CommandCheatFlag, CommandContext, CommandOutput, CommandParameterData, CommandPermissionLevel, CommandRegistry, CommandUsageFlag, CommandVisibilityFlag, MCRESULT } from './bds/command';
import { CommandOrigin, ServerCommandOrigin } from './bds/commandorigin';
import type { Dimension as Dimension } from './bds/dimension';
import { ServerLevel } from './bds/level';
import { serverInstance } from './bds/server';
import { capi } from './capi';
import { events } from './event';
import { makefunc } from './makefunc';
import { nativeClass, nativeField } from './nativeclass';
import { bool_t, CxxString, int32_t, NativeType, Type, void_t } from './nativetype';
import { SharedPtr } from './sharedpointer';
import minecraft = require('./minecraft');
import CommandVersion = minecraft.CommandVersion;

// registerer

@nativeClass()
export class CustomCommand extends Command {
    @nativeField(Command.VFTable)
    self_vftable:Command.VFTable;

    [NativeType.ctor]():void {
        this.self_vftable.destructor = customCommandDtor;
        this.self_vftable.execute = null;
        this.vftable = this.self_vftable;
    }

    execute(origin:CommandOrigin, output:CommandOutput):void {
        // empty
    }
}

export class CustomCommandFactory {
    constructor(
        public readonly registry:CommandRegistry,
        public readonly name:string) {
    }
    overload<PARAMS extends Record<string, Type<any>|[Type<any>, boolean]>>(
        callback:(params:{
            [key in keyof PARAMS]:PARAMS[key] extends [Type<infer F>, infer V] ?
                (V extends true ? F|undefined : F) :
                (PARAMS[key] extends {prototype:infer F} ? F : PARAMS[key] extends Type<infer F> ? F : never)
            }, origin:CommandOrigin, output:CommandOutput)=>void,
        parameters:PARAMS):this {

        const paramNames:[keyof CustomCommandImpl, (keyof CustomCommandImpl)?][] = [];
        class CustomCommandImpl extends CustomCommand {
            [NativeType.ctor]():void {
                this.self_vftable.execute = customCommandExecute;
            }
            execute(origin:CommandOrigin, output:CommandOutput):void {
                try {
                    const nobj:Record<keyof CustomCommandImpl, any> = {} as any;
                    for (const [name, optkey] of paramNames) {
                        if (optkey == null || this[optkey]) {
                            nobj[name] = this[name];
                        }
                    }
                    callback(nobj as any, origin, output);
                } catch (err) {
                    events.errorFire(err);
                }
            }
        }

        (parameters as any).__proto__ = null;
        const fields:Record<string, Type<any>> = Object.create(null);
        for (const name in parameters) {
            let optional = false;
            let type:Type<any>|[Type<any>,boolean] = parameters[name];
            if (type instanceof Array) {
                optional = type[1];
                type = type[0];
            }
            if (name in fields) throw Error(`${name}: field name duplicated`);
            fields[name] = type;
            if (optional) {
                const optkey = name+'__set';
                if (optkey in fields) throw Error(`${optkey}: field name duplicated`);
                fields[optkey] = bool_t;
                paramNames.push([name as keyof CustomCommandImpl, optkey as keyof CustomCommandImpl]);
            } else {
                paramNames.push([name as keyof CustomCommandImpl]);
            }
        }

        const params:CommandParameterData[] = [];
        CustomCommandImpl.define(fields);
        for (const [name, optkey] of paramNames) {
            if (optkey != null) params.push(CustomCommandImpl.optional(name, optkey as any));
            else params.push(CustomCommandImpl.mandatory(name, null));
        }

        const customCommandExecute = makefunc.np(function(this:CustomCommandImpl, origin:CommandOrigin, output:CommandOutput){
            this.execute(origin, output);
        }, void_t, {this:CustomCommandImpl}, CommandOrigin, CommandOutput);

        this.registry.registerOverload(this.name, CustomCommandImpl as any, params as any);
        return this;
    }

    alias(alias:string):this {
        this.registry.registerAlias(this.name, alias);
        return this;
    }
}

// executer

const commandVersion = CommandVersion.CurrentVersion;
const commandContextRefCounterVftable = minecraft.std._Ref_count_obj2.make(minecraft.CommandContext).addressof_vftable;
const CommandContextSharedPtr = SharedPtr.make(CommandContext);

function createCommandContext(command:CxxString, commandOrigin:CommandOrigin):SharedPtr<CommandContext> {
    const sharedptr = new CommandContextSharedPtr(true);
    sharedptr.create(commandContextRefCounterVftable);
    sharedptr.p!.constructWith(command, commandOrigin, commandVersion);
    return sharedptr;
}

function createServerCommandOrigin(name:CxxString, level:ServerLevel, permissionLevel:number, dimension:minecraft.DimensionId):CommandOrigin {
    const origin = capi.malloc(ServerCommandOrigin[NativeType.size]).as(ServerCommandOrigin);
    origin.constructWith(name, level, permissionLevel, dimension);
    return origin;
}

// namespace

/**
 * @deprecated use bdsx.commands
 */
export namespace command {

    /**
     * @deprecated use bdsx.commands
     */
    export function register(name:string,
        description:string,
        perm:CommandPermissionLevel = CommandPermissionLevel.Normal,
        flags1:CommandCheatFlag|CommandVisibilityFlag = CommandCheatFlag.NotCheat,
        flags2:CommandUsageFlag|CommandVisibilityFlag = CommandUsageFlag._Unknown):CustomCommandFactory {
        const registry = serverInstance.minecraft.getCommands().getRegistry();
        const cmd = registry.findCommand(name);
        if (cmd !== null) throw Error(`${name}: command already registered`);
        registry.registerCommand(name, description, perm, flags1, flags2);
        return new CustomCommandFactory(registry, name);
    }

    /**
     * it does the same thing with bedrockServer.executeCommandOnConsole
     * but call the internal function directly
     * @deprecated use bdsx.commands
     */
    export function execute(command:string, mute:boolean=true, permissionLevel:number=4, dimension:Dimension|null = null):MCRESULT {
        const origin = createServerCommandOrigin('Server',
            serverInstance.minecraft.getLevel() as ServerLevel, // I'm not sure it's always ServerLevel
            permissionLevel,
            dimension as any);

        const ctx = createCommandContext(command, origin);
        const res = serverInstance.minecraft.getCommands().executeCommand(ctx, mute);

        ctx.destruct();
        origin.destruct();

        return res;
    }
}

const customCommandDtor = makefunc.np(function(){
    this[NativeType.dtor]();
}, void_t, {this:CustomCommand}, int32_t);
