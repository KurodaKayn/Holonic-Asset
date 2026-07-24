import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const sourceExtensions = new Set([".ts", ".tsx"]);
const forbiddenUiImport =
  /from\s+["']@\/(?:adapters\/|data\/[^"']+\.(?:mock|seed))[^"']*["']/g;

function listSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return listSourceFiles(path);
    }

    return sourceExtensions.has(extname(entry.name)) ? [path] : [];
  });
}

describe("data layer boundaries", () => {
  it("keeps UI modules independent from adapters, mock implementations, and seeds", () => {
    const sourceRoot = fileURLToPath(new URL("../", import.meta.url));
    const uiRoots = ["app/routes", "components", "pages"];
    const violations = uiRoots.flatMap((root) =>
      listSourceFiles(join(sourceRoot, root)).flatMap((path) => {
        const source = readFileSync(path, "utf8");
        const imports = source.match(forbiddenUiImport) ?? [];
        return imports.map((statement) => ({
          file: path.slice(sourceRoot.length),
          statement,
        }));
      }),
    );

    expect(violations).toEqual([]);
  });
});
