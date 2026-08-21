/**
 * Splits a compound shell command into the segments separated by the
 * `&&`, `||`, `;`, and `|` control operators.
 */
export declare class CommandSplitter {
    private static readonly operatorPattern;
    /**
     * @param command - The raw shell command string.
     * @returns The trimmed command segments, in order, with operators removed.
     */
    static split(command: string): string[];
}
