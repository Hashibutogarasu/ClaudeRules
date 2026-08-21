import type { HookInput } from "@claude-rules/types";
import { HookChannel } from "./hook-io.mjs";
import { HookDecisionError } from "./errors.mjs";
import { L10nGenerator } from "./l10n.mjs";

/**
 * Wraps a hook's detection logic with the common PreToolUse entrypoint
 * contract: read the payload from stdin, run `detect`, and if it throws a
 * {@link HookDecisionError}, translate its l10n key and write the resulting
 * permission decision to stdout.
 */
export class HookRunner {
  /**
   * @param detect - Detection logic that throws a {@link HookDecisionError}
   *   subclass to report a deny/ask decision, or returns normally to allow.
   */
  static async run(detect: (input: HookInput) => void | Promise<void>): Promise<void> {
    const input = await HookChannel.readInput();
    try {
      await detect(input);
    } catch (error) {
      if (error instanceof HookDecisionError) {
        HookChannel.writeDecision(error.decision, L10nGenerator.translate(error.l10nKey, error.params));
        return;
      }
      throw error;
    }
  }
}
