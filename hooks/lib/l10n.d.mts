import type { MessageKey } from "@claude-rules/types";
/**
 * Loads locale message catalogs from the JSON assets under
 * `hooks/assets/locales/` and translates ClaudeRules hook decision message
 * keys against the active locale.
 */
export declare class L10nGenerator {
    private static readonly fallbackLocale;
    private static readonly catalogCache;
    private static loadCatalog;
    private static resolveLocale;
    /**
     * @param key - The message key to translate.
     * @param params - Optional `{name}`-style placeholders to substitute.
     * @returns The translated, interpolated message for the active locale,
     *   falling back to {@link fallbackLocale} when its asset is missing.
     */
    static translate(key: MessageKey, params?: Record<string, string>): string;
}
