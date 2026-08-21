import { HookRunner } from "./lib/run-hook.mjs";
import { HookChannel } from "./lib/hook-io.mjs";
import { CommandSplitter } from "./lib/shell.mjs";
import { AndroidLaunchDeniedError } from "./lib/errors.mjs";
/** Detects commands that launch an Android app natively (adb, emulator, or a Gradle install+launch). */
class AndroidLaunchDetector {
    static launchPatterns = [
        /\badb\s+shell\s+am\s+start\b/,
        /\badb\s+shell\s+monkey\b/,
        /\bemulator\s+-avd\b/,
        /\bgradlew(?:\.bat)?\b[^&|;]*\binstall(Debug|Release)?\b/,
    ];
    static isAndroidLaunch(segment) {
        return AndroidLaunchDetector.launchPatterns.some((pattern) => pattern.test(segment));
    }
    /**
     * @param command - The Bash command about to run.
     * @throws {AndroidLaunchDeniedError} When a segment launches an Android app.
     */
    static check(command) {
        if (!command) {
            return;
        }
        const segments = CommandSplitter.split(command);
        const targets = segments.length > 0 ? segments : [command];
        if (targets.some((segment) => AndroidLaunchDetector.isAndroidLaunch(segment))) {
            throw new AndroidLaunchDeniedError();
        }
    }
}
void HookRunner.run((input) => {
    AndroidLaunchDetector.check(HookChannel.extractBashCommand(input));
});
