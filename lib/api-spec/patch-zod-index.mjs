import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const dir = dirname(fileURLToPath(import.meta.url));
const indexPath = resolve(dir, "../api-zod/src/index.ts");
const content = readFileSync(indexPath, "utf8");
const patched = content.replace(/^export \* from ['"]\.\/generated\/types['"];?\n?/m, "");
writeFileSync(indexPath, patched);
console.log("Patched api-zod/src/index.ts — removed types re-export");
