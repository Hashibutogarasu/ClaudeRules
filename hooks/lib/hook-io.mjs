/**
 * Reads a PreToolUse hook payload from stdin, extracts the fields the
 * ClaudeRules hooks need, and writes a permission decision back to stdout
 * in the format Claude Code expects.
 */
export class HookChannel {
    /**
     * Reads the full stdin stream and parses it as the PreToolUse JSON payload.
     *
     * @returns The parsed hook input, or an empty object if stdin was blank.
     */
    static async readInput() {
        const chunks = [];
        for await (const chunk of process.stdin) {
            chunks.push(chunk);
        }
        const raw = Buffer.concat(chunks).toString("utf8").trim();
        return raw.length > 0 ? JSON.parse(raw) : {};
    }
    /**
     * Extracts the Bash `command` string from a PreToolUse payload.
     *
     * @param input - The parsed hook input.
     * @returns The command string, or an empty string if absent.
     */
    static extractBashCommand(input) {
        const toolInput = input.tool_input;
        return typeof toolInput?.command === "string" ? toolInput.command : "";
    }
    /**
     * Resolves the workspace root a hook should treat as the safe boundary.
     *
     * @param input - The parsed hook input.
     * @returns `CLAUDE_PROJECT_DIR` when set, otherwise the payload's `cwd`,
     *   otherwise the hook process's own working directory.
     */
    static resolveWorkspaceRoot(input) {
        return process.env.CLAUDE_PROJECT_DIR ?? (typeof input.cwd === "string" ? input.cwd : process.cwd());
    }
    /**
     * Writes a PreToolUse permission decision to stdout.
     *
     * @param decision - The permission decision to report.
     * @param reason - The human-readable, already-translated reason shown to
     *   the user.
     */
    static writeDecision(decision, reason) {
        const result = {
            hookSpecificOutput: {
                hookEventName: "PreToolUse",
                permissionDecision: decision,
                permissionDecisionReason: reason,
            },
        };
        process.stdout.write(JSON.stringify(result));
    }
}
