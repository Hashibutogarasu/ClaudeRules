import { FlutterRunDeniedError } from "./lib/errors.mjs";
import { HookChannel } from "./lib/hook-io.mjs";
import { HookRunner } from "./lib/run-hook.mjs";
import { CommandSplitter } from "./lib/shell.mjs";
/** Detects `flutter run`/`install`/`devices` invocations against a real device or emulator. */
class FlutterRunDetector {
    static flutterRunPattern = /\bflutter\s+(run|install|devices)\b/;
    /**
     * @param command - The Bash command about to run.
     * @throws {FlutterRunDeniedError} When a segment runs `flutter run`/`install`/`devices`.
     */
    static check(command) {
        if (!command) {
            return;
        }
        const segments = CommandSplitter.split(command);
        const targets = segments.length > 0 ? segments : [command];
        if (
            targets.some((segment) =>
                FlutterRunDetector.flutterRunPattern.test(segment),
            )
        ) {
            throw new FlutterRunDeniedError();
        }
    }
}
void HookRunner.run((input) => {
    FlutterRunDetector.check(HookChannel.extractBashCommand(input));
});
