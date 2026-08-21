import { HookRunner } from "./lib/run-hook.mjs";
import { HookChannel } from "./lib/hook-io.mjs";
import { CommandSplitter } from "./lib/shell.mjs";
import { EchoSeparatorDeniedError } from "./lib/errors.mjs";

/** Detects `echo` invocations used purely as a visual separator between commands. */
class EchoSeparatorDetector {
  private static readonly separatorContentPattern = new RegExp(
    "^$" + "|^([-=_*#~+.^])\\1+(\\\\n)?$" + "|^[-=_*#~+]{2,}.*[-=_*#~+]{2,}(\\\\n)?$",
  );

  private static readonly echoInvocationPattern = /^echo\b(?:\s+-[a-zA-Z-]+)*\s*([\s\S]*)$/;

  private static stripQuotes(value: string): string {
    const trimmed = value.trim();
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    if (trimmed.length >= 2 && first === last && (first === '"' || first === "'")) {
      return trimmed.slice(1, -1).trim();
    }
    return trimmed;
  }

  private static looksLikeSeparator(echoArgs: string): boolean {
    return EchoSeparatorDetector.separatorContentPattern.test(EchoSeparatorDetector.stripQuotes(echoArgs));
  }

  /**
   * @param command - The Bash command about to run.
   * @throws {EchoSeparatorDeniedError} When a segment is a separator-only echo.
   */
  static check(command: string): void {
    if (!command.includes("echo")) {
      return;
    }
    const segments = CommandSplitter.split(command);
    if (segments.length < 2) {
      return;
    }
    const violated = segments.some((segment) => {
      const match = EchoSeparatorDetector.echoInvocationPattern.exec(segment);
      return match !== null && EchoSeparatorDetector.looksLikeSeparator(match[1]);
    });
    if (violated) {
      throw new EchoSeparatorDeniedError();
    }
  }
}

void HookRunner.run((input) => {
  EchoSeparatorDetector.check(HookChannel.extractBashCommand(input));
});
