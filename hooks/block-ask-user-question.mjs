import { AskUserQuestionDeniedError } from "./lib/errors.mjs";
import { HookRunner } from "./lib/run-hook.mjs";
/** Unconditionally denies every `AskUserQuestion` call. */
class AskUserQuestionGate {
    /** @throws {AskUserQuestionDeniedError} Always. */
    static check() {
        throw new AskUserQuestionDeniedError();
    }
}
void HookRunner.run(() => {
    AskUserQuestionGate.check();
});
