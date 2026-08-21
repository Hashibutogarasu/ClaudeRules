import { HookRunner } from "./lib/run-hook.mjs";
import { AskUserQuestionDeniedError } from "./lib/errors.mjs";

/** Unconditionally denies every `AskUserQuestion` call. */
class AskUserQuestionGate {
  /** @throws {AskUserQuestionDeniedError} Always. */
  static check(): void {
    throw new AskUserQuestionDeniedError();
  }
}

void HookRunner.run(() => {
  AskUserQuestionGate.check();
});
