import { HookRunner } from "./lib/run-hook.mjs";
import { HookChannel } from "./lib/hook-io.mjs";
import { CommandSplitter } from "./lib/shell.mjs";
import { PrintfSeparatorDeniedError } from "./lib/errors.mjs";

/** Detects `printf` invocations used purely as a visual separator between commands. */
class PrintfSeparatorDetector {
  private static readonly separatorContentPattern = new RegExp(
    "^$" + "|^([-=_*#~+.^])\\1+(\\\\n)?$" + "|^[-=_*#~+]{2,}.*[-=_*#~+]{2,}(\\\\n)?$",
  );

  private static readonly printfInvocationPattern = /^printf\b(?:\s+-[a-zA-Z-]+)*\s*([\s\S]*)$/;

  private static stripQuotes(value: string): string {
    const trimmed = value.trim();
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    if (trimmed.length >= 2 && first === last && (first === '"' || first === "'")) {
      return trimmed.slice(1, -1).trim();
    }
    return trimmed;
  }

  private static looksLikeSeparator(printfArgs: string): boolean {
    return PrintfSeparatorDetector.separatorContentPattern.test(PrintfSeparatorDetector.stripQuotes(printfArgs));
  }

  /**
   * @param command - The Bash command about to run.
   * @throws {PrintfSeparatorDeniedError} When a segment is a separator-only printf.
   */
  static check(command: string): void {
    if (!command.includes("printf")) {
      return;
    }
    const segments = CommandSplitter.split(command);
    if (segments.length < 2) {
      return;
    }
    const violated = segments.some((segment) => {
      const match = PrintfSeparatorDetector.printfInvocationPattern.exec(segment);
      return match !== null && PrintfSeparatorDetector.looksLikeSeparator(match[1]);
    });
    if (violated) {
      throw new PrintfSeparatorDeniedError();
    }
  }
}

void HookRunner.run((input) => {
  PrintfSeparatorDetector.check(HookChannel.extractBashCommand(input));
});
