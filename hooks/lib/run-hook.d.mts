import type { HookInput } from "@claude-rules/types";
/**
 * Wraps a hook's detection logic with the common PreToolUse entrypoint
 * contract: read the payload from stdin, run `detect`, and if it throws a
 * {@link HookDecisionError}, translate its l10n key and write the resulting
 * permission decision to stdout.
 */
export declare class HookRunner {
    /**
     * @param detect - Detection logic that throws a {@link HookDecisionError}
     *   subclass to report a deny/ask decision, or returns normally to allow.
     */
    static run(detect: (input: HookInput) => void | Promise<void>): Promise<void>;
}
