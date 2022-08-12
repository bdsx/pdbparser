import { bool_t, float32_t, int32_t } from "../../nativetype";
import { GameRule } from "..";

declare module ".." {
    namespace GameRule {
        interface Value {
            boolVal:bool_t;
            intVal:int32_t;
            floatVal:float32_t;
        }
    }
}

GameRule.Value.define({
    boolVal:[bool_t, {ghost:true}],
    intVal:[int32_t, {ghost:true}],
    floatVal:float32_t,
});