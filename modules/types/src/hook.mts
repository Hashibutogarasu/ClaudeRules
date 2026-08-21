/**
 * Shape of the JSON payload Claude Code sends to a PreToolUse hook on
 * stdin. Only the fields the ClaudeRules hooks rely on are declared; the
 * payload may contain additional fields that are ignored.
 */
export interface HookInput {
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  cwd?: string;
  [key: string]: unknown;
}

/** The permission decision a PreToolUse hook may report back. */
export type PermissionDecision = "allow" | "deny" | "ask";

/** The subset of {@link PermissionDecision} a {@link HookDecisionError} may carry. */
export type HookDecision = Extract<PermissionDecision, "deny" | "ask">;
