/**
 * Splits a compound shell command into the segments separated by the
 * `&&`, `||`, `;`, and `|` control operators.
 */
export class CommandSplitter {
    static operatorPattern = /(&&|\|\||;|\|)/;
    /**
     * @param command - The raw shell command string.
     * @returns The trimmed command segments, in order, with operators removed.
     */
    static split(command) {
        const parts = command.split(CommandSplitter.operatorPattern);
        const segments = [];
        for (let i = 0; i < parts.length; i += 2) {
            segments.push(parts[i].trim());
        }
        return segments;
    }
}
