import { HookRunner } from "./lib/run-hook.mjs";
import { HookChannel } from "./lib/hook-io.mjs";
import { CommandSplitter } from "./lib/shell.mjs";
import { NeoForgeClientLaunchDeniedError } from "./lib/errors.mjs";

/** Detects Gradle invocations that launch a NeoForge mod's development client. */
class NeoForgeClientLaunchDetector {
  private static readonly gradleWrapperPattern = /\bgradlew(?:\.bat)?\b|(?:^|\s)gradle\b/;

  private static readonly runClientTaskPattern = /(^|[\s:])runClient(Data)?\b/;

  private static isClientLaunch(segment: string): boolean {
    return (
      NeoForgeClientLaunchDetector.gradleWrapperPattern.test(segment) &&
      NeoForgeClientLaunchDetector.runClientTaskPattern.test(segment)
    );
  }

  /**
   * @param command - The Bash command about to run.
   * @throws {NeoForgeClientLaunchDeniedError} When a segment runs `runClient`/`runClientData`.
   */
  static check(command: string): void {
    if (!command) {
      return;
    }
    const segments = CommandSplitter.split(command);
    const targets = segments.length > 0 ? segments : [command];
    if (targets.some((segment) => NeoForgeClientLaunchDetector.isClientLaunch(segment))) {
      throw new NeoForgeClientLaunchDeniedError();
    }
  }
}

void HookRunner.run((input) => {
  NeoForgeClientLaunchDetector.check(HookChannel.extractBashCommand(input));
});
