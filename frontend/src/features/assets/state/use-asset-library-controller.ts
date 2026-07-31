import { useCallback, useEffect, useMemo, useState } from "react";

import {
  useAssetLibraryQuery,
  useCopyAssetMutation,
  useDeleteAssetMutation,
  useEnqueueGenerationMutation,
  useGenerationRunsQuery,
} from "@/model";
import type { CreationRequest, GenerationRun } from "@/features/generation";
import type { ProjectSummary } from "@/features/project";

import { useAssetLibrary } from "./useAssetLibrary";
import type { AssetKind } from "../types";

export type AssetLibraryController = {
  project?: ProjectSummary;
  query: string;
  selectedKinds: AssetKind[];
  filteredAssets: ReturnType<typeof useAssetLibrary>["filteredAssets"];
  generationRuns: GenerationRun[];
  createAsset: (request: CreationRequest) => void;
  copyAsset: (assetId: string) => void;
  deleteAsset: (assetId: string) => void;
  openAsset: (assetId: string) => void;
  setQuery: (query: string) => void;
  setSelectedKinds: (kinds: AssetKind[]) => void;
};

type UseAssetLibraryControllerInput = {
  project?: ProjectSummary;
  onOpenAsset: (assetId: string) => void;
};

export function useAssetLibraryController({
  project,
  onOpenAsset,
}: UseAssetLibraryControllerInput): AssetLibraryController {
  const [query, setQuery] = useState("");
  const projectId = project?.id;
  const { data: assetGroups = [] } = useAssetLibraryQuery(projectId);
  const { data: generationRuns = [] } = useGenerationRunsQuery(projectId);
  const { mutate: copyAsset } = useCopyAssetMutation();
  const { mutate: deleteAsset } = useDeleteAssetMutation();
  const { mutate: enqueueGeneration } = useEnqueueGenerationMutation();
  const { filteredAssets, selectedKinds, setSelectedKinds } = useAssetLibrary(
    assetGroups,
    query,
  );

  useEffect(() => {
    setQuery("");
  }, [projectId]);

  const createAsset = useCallback(
    (request: CreationRequest) => {
      if (!projectId) return;
      enqueueGeneration({ projectId, request });
    },
    [enqueueGeneration, projectId],
  );

  const copyProjectAsset = useCallback(
    (assetId: string) => {
      if (!projectId) return;
      copyAsset({ projectId, assetId });
    },
    [copyAsset, projectId],
  );

  const deleteProjectAsset = useCallback(
    (assetId: string) => {
      if (!projectId) return;
      deleteAsset({ projectId, assetId });
    },
    [deleteAsset, projectId],
  );

  return useMemo(
    () => ({
      project,
      query,
      selectedKinds,
      filteredAssets,
      generationRuns,
      createAsset,
      copyAsset: copyProjectAsset,
      deleteAsset: deleteProjectAsset,
      openAsset: onOpenAsset,
      setQuery,
      setSelectedKinds,
    }),
    [
      createAsset,
      copyProjectAsset,
      deleteProjectAsset,
      filteredAssets,
      generationRuns,
      onOpenAsset,
      project,
      query,
      selectedKinds,
      setSelectedKinds,
    ],
  );
}
