import { afterEach, describe, expect, it } from "vitest";

import {
  deleteMockQuickAsset,
  generateMockQuickAsset,
  listMockQuickAssets,
  resetQuickGenerationMockData,
} from "@/data/quick-generation/quick-generation.mock";

const withoutDelay = { delayMs: 0 };

afterEach(() => {
  resetQuickGenerationMockData();
});

describe("quick generation mock API", () => {
  it("returns isolated copies of the seeded assets", async () => {
    const first = await listMockQuickAssets(withoutDelay);
    first[0].prompt = "Changed by a consumer";

    const second = await listMockQuickAssets(withoutDelay);

    expect(second).toHaveLength(3);
    expect(second[0]?.id).toBe("mushroom-courier");
    expect(second[0]?.prompt).not.toBe("Changed by a consumer");
  });

  it("creates and updates an asset through generation", async () => {
    const created = await generateMockQuickAsset(
      {
        prompt: "  A tiny crystal golem  ",
        size: "64 × 64 px",
        referenceFileName: "crystal.png",
      },
      withoutDelay,
    );
    const updated = await generateMockQuickAsset(
      {
        assetId: created.id,
        prompt: "A blue crystal golem",
        size: "128 × 128 px",
      },
      withoutDelay,
    );

    expect(created).toMatchObject({
      prompt: "A tiny crystal golem",
      referenceFileName: "crystal.png",
    });
    expect(updated).toMatchObject({
      id: created.id,
      prompt: "A blue crystal golem",
      size: "128 × 128 px",
    });
    await expect(listMockQuickAssets(withoutDelay)).resolves.toHaveLength(4);
  });

  it("deletes an asset and resets runtime data", async () => {
    await deleteMockQuickAsset("mushroom-courier", withoutDelay);
    await expect(listMockQuickAssets(withoutDelay)).resolves.toHaveLength(2);

    resetQuickGenerationMockData();

    await expect(listMockQuickAssets(withoutDelay)).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "mushroom-courier" }),
      ]),
    );
  });

  it("returns consistent validation and not-found errors", async () => {
    await expect(
      generateMockQuickAsset({ prompt: " ", size: "64 × 64 px" }, withoutDelay),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(
      deleteMockQuickAsset("missing", withoutDelay),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});
