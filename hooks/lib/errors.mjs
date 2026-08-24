/**
 * Base class for the errors a hook's detection logic throws to signal a
 * permission decision. The decision and the l10n key used to render its
 * reason are fixed by the concrete subclass, so callers never need to know
 * either.
 */
export class HookDecisionError extends Error {
    decision;
    l10nKey;
    params;
    constructor(message, decision, l10nKey, params) {
        super(message);
        this.decision = decision;
        this.l10nKey = l10nKey;
        this.params = params;
        this.name = new.target.name;
    }
}
/** Thrown when `echo` is used purely as a visual separator between commands. */
export class EchoSeparatorDeniedError extends HookDecisionError {
    constructor() {
        super("echo used as a visual separator between commands", "deny", "echoSeparatorDenied");
    }
}
/** Thrown when `printf` is used purely as a visual separator between commands. */
export class PrintfSeparatorDeniedError extends HookDecisionError {
    constructor() {
        super("printf used as a visual separator between commands", "deny", "printfSeparatorDenied");
    }
}
/** Thrown when a loop dumps multiple files' contents behind `echo` headers instead of using the Read tool. */
export class VerboseFileDumpDeniedError extends HookDecisionError {
    constructor() {
        super("multiple files dumped with echo headers inside a loop", "deny", "verboseFileDumpDenied");
    }
}
/** Thrown when a command launches a NeoForge mod's development client. */
export class NeoForgeClientLaunchDeniedError extends HookDecisionError {
    constructor() {
        super("NeoForge mod client launch is blocked", "deny", "neoforgeClientLaunchDenied");
    }
}
/** Thrown when a command runs `flutter run`. */
export class FlutterRunDeniedError extends HookDecisionError {
    constructor() {
        super("flutter run is blocked", "deny", "flutterRunDenied");
    }
}
/** Thrown when a command launches an Android app natively (adb/emulator/gradlew). */
export class AndroidLaunchDeniedError extends HookDecisionError {
    constructor() {
        super("Android app launch is blocked", "deny", "androidLaunchDenied");
    }
}
/** Thrown when `rm -rf` targets a path outside the workspace root. */
export class RmOutsideWorkspaceAskError extends HookDecisionError {
    constructor() {
        super("rm -rf targets a path outside the workspace", "ask", "rmOutsideWorkspaceAsk");
    }
}
/** Thrown unconditionally to deny every `AskUserQuestion` call. */
export class AskUserQuestionDeniedError extends HookDecisionError {
    constructor() {
        super("AskUserQuestion is always denied", "deny", "askUserQuestionDenied");
    }
}
