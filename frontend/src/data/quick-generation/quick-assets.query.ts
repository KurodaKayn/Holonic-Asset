import { queryOptions, useQuery } from "@tanstack/react-query";

import { quickGenerationApi } from "@/data/quick-generation/quick-generation.api";
import { quickGenerationKeys } from "@/data/quick-generation/quick-generation.keys";

export function quickAssetsQueryOptions() {
  return queryOptions({
    queryKey: quickGenerationKeys.assets(),
    queryFn: quickGenerationApi.listAssets,
  });
}

export function useQuickAssetsQuery() {
  return useQuery(quickAssetsQueryOptions());
}
