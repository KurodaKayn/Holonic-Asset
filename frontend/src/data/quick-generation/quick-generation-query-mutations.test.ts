import { QueryClient, type MutationOptions } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  deleteQuickAssetMutationOptions,
  generateQuickAssetMutationOptions,
} from "@/data/quick-generation/quick-asset.mutations";
import { quickAssetsQueryOptions } from "@/data/quick-generation/quick-assets.query";
import { quickGenerationApi } from "@/data/quick-generation/quick-generation.api";
import { quickGenerationKeys } from "@/data/quick-generation/quick-generation.keys";
import type { QuickGenerationAsset } from "@/types/quick-generation";

const firstAsset: QuickGenerationAsset = {
  id: "first",
  prompt: "First asset",
  size: "64 × 64 px",
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("quick generation React Query integration", () => {
  it("loads assets under the shared query key", async () => {
    const queryClient = createTestQueryClient();
    vi.spyOn(quickGenerationApi, "listAssets").mockResolvedValue([firstAsset]);

    const result = await queryClient.fetchQuery(quickAssetsQueryOptions());

    expect(result).toEqual([firstAsset]);
    expect(queryClient.getQueryData(quickGenerationKeys.assets())).toEqual([
      firstAsset,
    ]);
  });

  it("adds, replaces, and removes assets in the cache", async () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData<QuickGenerationAsset[]>(
      quickGenerationKeys.assets(),
      [firstAsset],
    );

    const created = {
      id: "created",
      prompt: "Created asset",
      size: "128 × 128 px",
    };
    vi.spyOn(quickGenerationApi, "generateAsset").mockResolvedValue(created);
    await executeMutation(
      queryClient,
      generateQuickAssetMutationOptions(queryClient),
      { prompt: created.prompt, size: created.size },
    );

    const updated = { ...created, prompt: "Updated asset" };
    vi.spyOn(quickGenerationApi, "generateAsset").mockResolvedValue(updated);
    await executeMutation(
      queryClient,
      generateQuickAssetMutationOptions(queryClient),
      {
        assetId: created.id,
        prompt: updated.prompt,
        size: updated.size,
      },
    );

    vi.spyOn(quickGenerationApi, "deleteAsset").mockResolvedValue();
    await executeMutation(
      queryClient,
      deleteQuickAssetMutationOptions(queryClient),
      firstAsset.id,
    );

    expect(queryClient.getQueryData(quickGenerationKeys.assets())).toEqual([
      updated,
    ]);
  });
});

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function executeMutation<TData, TVariables>(
  queryClient: QueryClient,
  options: MutationOptions<TData, Error, TVariables, unknown>,
  variables: TVariables,
) {
  return queryClient
    .getMutationCache()
    .build<TData, Error, TVariables, unknown>(queryClient, options)
    .execute(variables);
}
