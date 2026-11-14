import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const sourceDir = new URL("commands-src/", root);
const outputDir = new URL("commands/", root);
const assetsDir = new URL("assets/", root);

const placeholder = /\{\{asset:([^}]+)\}\}/g;

for (const name of readdirSync(sourceDir)) {
    if (!name.endsWith(".md")) {
        continue;
    }
    const source = readFileSync(new URL(name, sourceDir), "utf8");
    const embedded = source.replace(placeholder, (_, assetName) =>
        readFileSync(new URL(assetName, assetsDir), "utf8").trimEnd(),
    );
    writeFileSync(new URL(name, outputDir), embedded);
    console.log(`embedded assets: ${fileURLToPath(new URL(name, outputDir))}`);
}
