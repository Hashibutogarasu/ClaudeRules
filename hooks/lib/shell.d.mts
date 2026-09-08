/**
 * Splits a compound shell command into the segments separated by the
 * `&&`, `||`, `;`, and `|` control operators.
 */
export declare class CommandSplitter {
    private static readonly operatorPattern;
    private static readonly heredocStartPattern;
    /**
     * @param command - The raw shell command string.
     * @returns The trimmed command segments, in order, with operators removed
     * and the contents of quoted strings/heredoc bodies blanked out so
     * literal text (e.g. a commit message or PR body) is never mistaken for
     * an executed command.
     */
    static split(command: string): string[];
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
    private static maskLiterals;
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
    private static maskHeredocBody;
}
