import type { ProjectSummary } from "@/features/project";

import { AssetLibraryWorkspace } from "./asset-library-workspace";
import { useAssetLibraryController } from "./state/use-asset-library-controller";

type AssetLibraryProps = {
  project?: ProjectSummary;
  onOpenAsset: (assetId: string) => void;
};

export function AssetLibrary({ project, onOpenAsset }: AssetLibraryProps) {
  const library = useAssetLibraryController({ project, onOpenAsset });

  return <AssetLibraryWorkspace library={library} />;
}
