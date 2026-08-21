import type { HookInput, PermissionDecision } from "@claude-rules/types";
/**
 * Reads a PreToolUse hook payload from stdin, extracts the fields the
 * ClaudeRules hooks need, and writes a permission decision back to stdout
 * in the format Claude Code expects.
 */
export declare class HookChannel {
    /**
     * Reads the full stdin stream and parses it as the PreToolUse JSON payload.
     *
     * @returns The parsed hook input, or an empty object if stdin was blank.
     */
    static readInput(): Promise<HookInput>;
    /**
     * Extracts the Bash `command` string from a PreToolUse payload.
     *
     * @param input - The parsed hook input.
     * @returns The command string, or an empty string if absent.
     */
    static extractBashCommand(input: HookInput): string;
    /**
     * Resolves the workspace root a hook should treat as the safe boundary.
     *
     * @param input - The parsed hook input.
     * @returns `CLAUDE_PROJECT_DIR` when set, otherwise the payload's `cwd`,
     *   otherwise the hook process's own working directory.
     */
    static resolveWorkspaceRoot(input: HookInput): string;
    /**
     * Writes a PreToolUse permission decision to stdout.
     *
     * @param decision - The permission decision to report.
     * @param reason - The human-readable, already-translated reason shown to
     *   the user.
     */
    static writeDecision(decision: PermissionDecision, reason: string): void;
}
