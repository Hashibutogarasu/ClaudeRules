import { isAbsolute, relative, resolve } from "node:path";
import { HookRunner } from "./lib/run-hook.mjs";
import { HookChannel } from "./lib/hook-io.mjs";
import { CommandSplitter } from "./lib/shell.mjs";
import { RmOutsideWorkspaceAskError } from "./lib/errors.mjs";

/** Detects `rm -rf` (and equivalents) whose targets resolve outside the workspace root. */
class RmOutsideWorkspaceDetector {
  private static readonly shortFlagPattern = /^-[a-zA-Z]+$/;
  private static readonly longRecursivePattern = /^--recursive$/;
  private static readonly longForcePattern = /^--force$/;
  private static readonly globCharacterPattern = /[*?[]/;
  private static readonly wordPattern = /"([^"]*)"|'([^']*)'|(\S+)/g;

  private static tokenize(segment: string): string[] {
    const tokens: string[] = [];
    for (const match of segment.matchAll(RmOutsideWorkspaceDetector.wordPattern)) {
      tokens.push(match[1] ?? match[2] ?? match[3]);
    }
    return tokens;
  }

  private static isRecursiveForceRemoval(tokens: readonly string[]): boolean {
    if (tokens[0] !== "rm") {
      return false;
    }
    let recursive = false;
    let force = false;
    for (const token of tokens.slice(1)) {
      if (token === "--") {
        break;
      }
      if (RmOutsideWorkspaceDetector.longRecursivePattern.test(token)) {
        recursive = true;
      } else if (RmOutsideWorkspaceDetector.longForcePattern.test(token)) {
        force = true;
      } else if (RmOutsideWorkspaceDetector.shortFlagPattern.test(token)) {
        if (token.includes("r") || token.includes("R")) {
          recursive = true;
        }
        if (token.includes("f")) {
          force = true;
        }
      }
    }
    return recursive && force;
  }

  private static extractTargets(tokens: readonly string[]): string[] {
    const targets: string[] = [];
    let sawSeparator = false;
    for (const token of tokens.slice(1)) {
      if (token === "--") {
        sawSeparator = true;
        continue;
      }
      if (!sawSeparator && token.startsWith("-")) {
        continue;
      }
      targets.push(token);
    }
    return targets;
  }

  private static isOutsideWorkspace(target: string, workspaceRoot: string): boolean {
    if (RmOutsideWorkspaceDetector.globCharacterPattern.test(target)) {
      return true;
    }
    const resolvedTarget = resolve(workspaceRoot, target);
    const relativePath = relative(workspaceRoot, resolvedTarget);
    return relativePath.startsWith("..") || isAbsolute(relativePath);
  }

  /**
   * @param command - The Bash command about to run.
   * @param workspaceRoot - The absolute path treated as the safe boundary.
   * @throws {RmOutsideWorkspaceAskError} When a recursive+forced `rm` targets a path outside `workspaceRoot`.
   */
  static check(command: string, workspaceRoot: string): void {
    if (!command.includes("rm")) {
      return;
    }
    const segments = CommandSplitter.split(command);
    const candidates = segments.length > 0 ? segments : [command];
    for (const segment of candidates) {
      const tokens = RmOutsideWorkspaceDetector.tokenize(segment);
      if (!RmOutsideWorkspaceDetector.isRecursiveForceRemoval(tokens)) {
        continue;
      }
      const targets = RmOutsideWorkspaceDetector.extractTargets(tokens);
      if (targets.some((target) => RmOutsideWorkspaceDetector.isOutsideWorkspace(target, workspaceRoot))) {
        throw new RmOutsideWorkspaceAskError();
      }
    }
  }
}

void HookRunner.run((input) => {
  RmOutsideWorkspaceDetector.check(HookChannel.extractBashCommand(input), HookChannel.resolveWorkspaceRoot(input));
});
