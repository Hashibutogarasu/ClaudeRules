import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Messages, MessageKey } from "@claude-rules/types";

/**
 * Loads locale message catalogs from the JSON assets under
 * `hooks/assets/locales/` and translates ClaudeRules hook decision message
 * keys against the active locale.
 */
export class L10nGenerator {
  private static readonly fallbackLocale = "ja";
  private static readonly catalogCache = new Map<string, Messages>();

  private static loadCatalog(locale: string): Messages {
    const cached = L10nGenerator.catalogCache.get(locale);
    if (cached) {
      return cached;
    }
    const assetPath = fileURLToPath(new URL(`../assets/locales/${locale}.json`, import.meta.url));
    const catalog = JSON.parse(readFileSync(assetPath, "utf8")) as Messages;
    L10nGenerator.catalogCache.set(locale, catalog);
    return catalog;
  }

  private static resolveLocale(): string {
    const lang = process.env.CLAUDE_RULES_LOCALE ?? process.env.LANG ?? "";
    return lang.toLowerCase().startsWith("en") ? "en" : L10nGenerator.fallbackLocale;
  }

  /**
   * @param key - The message key to translate.
   * @param params - Optional `{name}`-style placeholders to substitute.
   * @returns The translated, interpolated message for the active locale,
   *   falling back to {@link fallbackLocale} when its asset is missing.
   */
  static translate(key: MessageKey, params?: Record<string, string>): string {
    let catalog: Messages;
    try {
      catalog = L10nGenerator.loadCatalog(L10nGenerator.resolveLocale());
    } catch {
      catalog = L10nGenerator.loadCatalog(L10nGenerator.fallbackLocale);
    }
    let message = catalog[key];
    if (params) {
      for (const [name, value] of Object.entries(params)) {
        message = message.split(`{${name}}`).join(value);
      }
    }
    return message;
  }
}
