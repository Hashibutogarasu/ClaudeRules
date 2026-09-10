/**
 * Splits a compound shell command into the segments separated by the
 * `&&`, `||`, `;`, and `|` control operators.
 */
export class CommandSplitter {
    static operatorPattern = /(&&|\|\||;|\|)/;
    static heredocStartPattern = /^<<(-)?\s*(['"]?)([A-Za-z_]\w*)\2/;
    /**
     * @param command - The raw shell command string.
     * @returns The trimmed command segments, in order, with operators removed
     * and the contents of quoted strings/heredoc bodies blanked out so
     * literal text (e.g. a commit message or PR body) is never mistaken for
     * an executed command.
     */
    static split(command) {
        const masked = CommandSplitter.maskLiterals(command);
        const parts = masked.split(CommandSplitter.operatorPattern);
        const segments = [];
        for (let i = 0; i < parts.length; i += 2) {
            segments.push(parts[i].trim());
        }
        return segments;
    }
    /**
     * Replaces the contents of single-quoted strings, double-quoted strings,
     * and heredoc bodies with spaces so downstream pattern matching only
     * inspects text that Bash actually executes as commands, not literal
     * data such as commit messages or file contents passed via `<<EOF`.
     *
     * @param command - The raw shell command string.
     * @returns The command with non-executable literal text blanked out,
     * preserving the original length and layout.
     */
    static maskLiterals(command) {
        let result = "";
        let i = 0;
        const n = command.length;
        while (i < n) {
            const ch = command[i];
            if (ch === "'") {
                const end = command.indexOf("'", i + 1);
                const stop = end === -1 ? n : end + 1;
                result += " ".repeat(stop - i);
                i = stop;
                continue;
            }
            if (ch === '"') {
                let j = i + 1;
                while (j < n) {
                    if (command[j] === "\\") {
                        j += 2;
                        continue;
                    }
                    if (command[j] === '"') {
                        j += 1;
                        break;
                    }
                    j += 1;
                }
                result += " ".repeat(Math.min(j, n) - i);
                i = Math.min(j, n);
                continue;
            }
            if (ch === "<" && command[i + 1] === "<") {
                const heredocMatch = CommandSplitter.heredocStartPattern.exec(command.slice(i));
                if (heredocMatch) {
                    i = CommandSplitter.maskHeredocBody(command, i, heredocMatch, (masked) => {
                        result += masked;
                    });
                    continue;
                }
            }
            result += ch;
            i += 1;
        }
        return result;
    }
    /**
     * Blanks out a heredoc body, from the marker line through the delimiter
     * line, appending the masked text via `emit`.
     *
     * @param command - The full raw shell command string.
     * @param start - Index of the `<<`/`<<-` marker within `command`.
     * @param markerMatch - The regex match for the heredoc marker.
     * @param emit - Callback invoked with the masked text to append.
     * @returns The index immediately after the masked heredoc body.
     */
    static maskHeredocBody(command, start, markerMatch, emit) {
        const n = command.length;
        const [marker, dashFlag, , delimiter] = markerMatch;
        const afterMarker = start + marker.length;
        const newlineIdx = command.indexOf("\n", afterMarker);
        if (newlineIdx === -1) {
            emit(" ".repeat(n - start));
            return n;
        }
        emit(" ".repeat(newlineIdx + 1 - start));
        const delimiterPattern = dashFlag ? new RegExp(`^[ \\t]*${delimiter}[ \\t]*$`) : new RegExp(`^${delimiter}[ \\t]*$`);
        let lineStart = newlineIdx + 1;
        while (lineStart <= n) {
            const lineEnd = command.indexOf("\n", lineStart);
            const lineEndExclusive = lineEnd === -1 ? n : lineEnd;
            const line = command.slice(lineStart, lineEndExclusive);
            const lineLenWithNewline = (lineEnd === -1 ? n : lineEnd + 1) - lineStart;
            emit(" ".repeat(lineLenWithNewline));
            lineStart += lineLenWithNewline;
            if (delimiterPattern.test(line) || lineEnd === -1) {
                break;
            }
        }
        return lineStart;
    }
}
