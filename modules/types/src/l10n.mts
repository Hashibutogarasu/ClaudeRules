/**
 * Localized message catalog for every reason string a ClaudeRules hook may
 * report back to Claude Code. Every locale catalog must supply all keys.
 */
export interface Messages {
  echoSeparatorDenied: string;
  printfSeparatorDenied: string;
  verboseFileDumpDenied: string;
  neoforgeClientLaunchDenied: string;
  flutterRunDenied: string;
  androidLaunchDenied: string;
  rmOutsideWorkspaceAsk: string;
  askUserQuestionDenied: string;
}

/** A single localizable message key from {@link Messages}. */
export type MessageKey = keyof Messages;
