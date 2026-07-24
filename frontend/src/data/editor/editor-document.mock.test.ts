import { afterEach, describe, expect, it } from "vitest";

import { saveMockAssetRevision } from "@/data/project/project-asset.mock";
import { getMockEditorDocument } from "@/data/editor/editor-document.mock";
import { resetMockRepository } from "@/data/project/project-asset.mock";

const withoutDelay = { delayMs: 0 };

afterEach(() => {
  resetMockRepository();
});

describe("editor document mock API", () => {
  it("loads one asset document with its project and editor-specific content", async () => {
    const result = await getMockEditorDocument(
      { projectId: "moonlit-orchard", assetId: "forager-hero" },
      withoutDelay,
    );

    expect(result).toMatchObject({
      projectName: "Moonlit Orchard",
      asset: { id: "forager-hero", kind: "character" },
    });
    expect(result.document.character?.animations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "walk", frameCount: 8 }),
      ]),
    );
  });

  it("returns isolated documents and preserves a saved editor revision", async () => {
    const first = await getMockEditorDocument(
      { projectId: "moonlit-orchard", assetId: "forager-hero" },
      withoutDelay,
    );
    first.document.prompt = "Changed only in the consumer";

    const second = await getMockEditorDocument(
      { projectId: "moonlit-orchard", assetId: "forager-hero" },
      withoutDelay,
    );
    expect(second.document.prompt).not.toBe("Changed only in the consumer");

    const savedDocument = {
      ...second.document,
      prompt: "Move the forager to the left",
      character: {
        ...second.document.character!,
        nodePositions: { prototype: { x: 120, y: 160 } },
      },
    };
    await saveMockAssetRevision(
      "moonlit-orchard",
      "forager-hero",
      savedDocument,
    );

    const saved = await getMockEditorDocument(
      { projectId: "moonlit-orchard", assetId: "forager-hero" },
      withoutDelay,
    );
    expect(saved.asset.version).toBe("v5");
    expect(saved.document).toMatchObject({
      prompt: "Move the forager to the left",
      character: { nodePositions: { prototype: { x: 120, y: 160 } } },
    });
  });

  it("uses a consistent not-found error for missing projects and assets", async () => {
    await expect(
      getMockEditorDocument(
        { projectId: "missing-project", assetId: "forager-hero" },
        withoutDelay,
      ),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(
      getMockEditorDocument(
        { projectId: "moonlit-orchard", assetId: "missing-asset" },
        withoutDelay,
      ),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});
