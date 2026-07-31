import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { CreateAssetToolbar } from "@/features/generation/create-asset-toolbar";

import { AssetFilters } from "./asset-filters";
import { creatableAssetKinds } from "./types";
import type { AssetLibraryController } from "./state/use-asset-library-controller";

export function AssetLibraryToolbar({
  library,
}: {
  library: AssetLibraryController;
}) {
  const {
    createAsset,
    project,
    query,
    selectedKinds,
    setQuery,
    setSelectedKinds,
  } = library;

  return (
    <div className="flex w-full flex-col gap-3 rounded-3xl border bg-card p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="relative min-w-0 flex-1 lg:max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search assets"
            className="h-12 rounded-2xl bg-background pl-12 pr-4 text-base shadow-none md:text-base"
            placeholder="Search assets"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <AssetFilters
          selectedKinds={selectedKinds}
          onSelectedKindsChange={setSelectedKinds}
        />
      </div>
      {project ? (
        <CreateAssetToolbar
          assetKinds={creatableAssetKinds}
          project={project}
          onCreate={createAsset}
        />
      ) : null}
    </div>
  );
}
