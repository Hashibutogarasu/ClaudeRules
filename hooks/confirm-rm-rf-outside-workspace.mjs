import { isAbsolute, relative, resolve } from "node:path";
import { HookRunner } from "./lib/run-hook.mjs";
import { HookChannel } from "./lib/hook-io.mjs";
import { CommandSplitter } from "./lib/shell.mjs";
import { RmOutsideWorkspaceAskError } from "./lib/errors.mjs";
/** Detects `rm -rf` (and equivalents) whose targets resolve outside the workspace root. */
class RmOutsideWorkspaceDetector {
    static shortFlagPattern = /^-[a-zA-Z]+$/;
    static longRecursivePattern = /^--recursive$/;
    static longForcePattern = /^--force$/;
    static globCharacterPattern = /[*?[]/;
    static wordPattern = /"([^"]*)"|'([^']*)'|(\S+)/g;
    static tokenize(segment) {
        const tokens = [];
        for (const match of segment.matchAll(RmOutsideWorkspaceDetector.wordPattern)) {
            tokens.push(match[1] ?? match[2] ?? match[3]);
        }
        return tokens;
    }
    static isRecursiveForceRemoval(tokens) {
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
            }
            else if (RmOutsideWorkspaceDetector.longForcePattern.test(token)) {
                force = true;
            }
            else if (RmOutsideWorkspaceDetector.shortFlagPattern.test(token)) {
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
    static extractTargets(tokens) {
        const targets = [];
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
    static isOutsideWorkspace(target, workspaceRoot) {
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
    static check(command, workspaceRoot) {
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
