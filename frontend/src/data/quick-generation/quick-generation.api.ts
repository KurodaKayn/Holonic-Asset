import {
  deleteMockQuickAsset,
  generateMockQuickAsset,
  listMockQuickAssets,
} from "@/data/quick-generation/quick-generation.mock";
import type {
  GenerateQuickAssetInput,
  QuickGenerationAsset,
} from "@/types/quick-generation";

export type QuickGenerationApi = {
  listAssets: () => Promise<QuickGenerationAsset[]>;
  generateAsset: (
    input: GenerateQuickAssetInput,
  ) => Promise<QuickGenerationAsset>;
  deleteAsset: (assetId: string) => Promise<void>;
};

export const quickGenerationApi: QuickGenerationApi = {
  listAssets: listMockQuickAssets,
  generateAsset: generateMockQuickAsset,
  deleteAsset: deleteMockQuickAsset,
};
