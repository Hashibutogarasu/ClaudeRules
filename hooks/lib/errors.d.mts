import type { HookDecision, MessageKey } from "@claude-rules/types";
/**
 * Base class for the errors a hook's detection logic throws to signal a
 * permission decision. The decision and the l10n key used to render its
 * reason are fixed by the concrete subclass, so callers never need to know
 * either.
 */
export declare abstract class HookDecisionError extends Error {
    readonly decision: HookDecision;
    readonly l10nKey: MessageKey;
    readonly params?: Record<string, string> | undefined;
    protected constructor(message: string, decision: HookDecision, l10nKey: MessageKey, params?: Record<string, string> | undefined);
}
/** Thrown when `echo` is used purely as a visual separator between commands. */
export declare class EchoSeparatorDeniedError extends HookDecisionError {
    constructor();
}
/** Thrown when `printf` is used purely as a visual separator between commands. */
export declare class PrintfSeparatorDeniedError extends HookDecisionError {
    constructor();
}
/** Thrown when a command launches a NeoForge mod's development client. */
export declare class NeoForgeClientLaunchDeniedError extends HookDecisionError {
    constructor();
}
/** Thrown when a command runs `flutter run`. */
export declare class FlutterRunDeniedError extends HookDecisionError {
    constructor();
}
/** Thrown when a command launches an Android app natively (adb/emulator/gradlew). */
export declare class AndroidLaunchDeniedError extends HookDecisionError {
    constructor();
}
/** Thrown when `rm -rf` targets a path outside the workspace root. */
export declare class RmOutsideWorkspaceAskError extends HookDecisionError {
    constructor();
}
/** Thrown unconditionally to deny every `AskUserQuestion` call. */
export declare class AskUserQuestionDeniedError extends HookDecisionError {
    constructor();
}
