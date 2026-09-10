import { HookRunner } from "./lib/run-hook.mjs";
import { HookChannel } from "./lib/hook-io.mjs";
import { CommandSplitter } from "./lib/shell.mjs";
import { AndroidLaunchDeniedError } from "./lib/errors.mjs";
/**
 * Detects commands that install, launch, or otherwise interact with a real
 * Android device or emulator: `adb` (install, shell am start/monkey/
 * screencap/dumpsys, exec-out, logcat — tolerating global flags like
 * `-s <serial>` before the subcommand), `emulator`, or a Gradle
 * install+launch.
 */
class AndroidLaunchDetector {
    static launchPatterns = [
        /\badb\b(?:\s+-[a-zA-Z-]+(?:\s+\S+)?)*\s+install\b/,
        /\badb\b(?:\s+-[a-zA-Z-]+(?:\s+\S+)?)*\s+shell\s+am\s+start\b/,
        /\badb\b(?:\s+-[a-zA-Z-]+(?:\s+\S+)?)*\s+shell\s+monkey\b/,
        /\badb\b(?:\s+-[a-zA-Z-]+(?:\s+\S+)?)*\s+shell\s+(?:\S+\s+)*(screencap|dumpsys)\b/,
        /\badb\b(?:\s+-[a-zA-Z-]+(?:\s+\S+)?)*\s+exec-out\b/,
        /\badb\b(?:\s+-[a-zA-Z-]+(?:\s+\S+)?)*\s+logcat\b/,
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
