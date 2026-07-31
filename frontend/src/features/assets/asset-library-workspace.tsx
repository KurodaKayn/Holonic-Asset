import { ScrollArea } from "@/components/ui/scroll-area";
import { GenerationQueue } from "@/features/generation/generation-queue";

import { AssetCard } from "./asset-card";
import { AssetLibraryToolbar } from "./asset-library-toolbar";
import type { AssetLibraryController } from "./state/use-asset-library-controller";

export function AssetLibraryWorkspace({
  library,
}: {
  library: AssetLibraryController;
}) {
  const { filteredAssets, generationRuns, project } = library;

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center">
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          Please create a project or select an existing project from the project
          list on the left.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto w-full max-w-[96rem] px-5 py-7 sm:px-8 sm:py-9">
        <div className="pb-10 sm:pb-12">
          <AssetLibraryToolbar library={library} />
        </div>

        <GenerationQueue runs={generationRuns} />

        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
            {filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                accentClassName={asset.accentClassName}
                kind={asset.kind}
                kindLabel={asset.kindLabel}
                onOpen={() => library.openAsset(asset.id)}
                onCopy={() => library.copyAsset(asset.id)}
                onDelete={() => library.deleteAsset(asset.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-card px-6 py-20 text-center">
            <p className="text-sm font-medium">No assets found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another search or asset type.
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
