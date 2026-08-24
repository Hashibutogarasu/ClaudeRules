import { HookRunner } from "./lib/run-hook.mjs";
import { HookChannel } from "./lib/hook-io.mjs";
import { VerboseFileDumpDeniedError } from "./lib/errors.mjs";
/** Detects a loop that dumps multiple files' contents behind `echo` headers instead of reading them individually. */
class VerboseFileDumpDetector {
    static loopPattern = /\bfor\s+\S+\s+in\b|\bwhile\b|\bxargs\b/;
    static echoPattern = /\becho\b/;
    static dumpPattern = /\bcat\b|\bhead\b|\btail\b/;
    /**
     * @param command - The Bash command about to run.
     * @throws {VerboseFileDumpDeniedError} When the command loops over files,
     *   printing an `echo` header before dumping each one's contents.
     */
    static check(command) {
        if (!command) {
            return;
        }
        const isVerboseDump = VerboseFileDumpDetector.loopPattern.test(command) &&
            VerboseFileDumpDetector.echoPattern.test(command) &&
            VerboseFileDumpDetector.dumpPattern.test(command);
        if (isVerboseDump) {
            throw new VerboseFileDumpDeniedError();
        }
    }
}
void HookRunner.run((input) => {
    VerboseFileDumpDetector.check(HookChannel.extractBashCommand(input));
});
