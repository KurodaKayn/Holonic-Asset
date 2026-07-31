import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { recordApi } from "./record.api";
import { recordKeys } from "./record.keys";

export function recordQueryOptions(assetId: string) {
  return queryOptions({
    queryKey: recordKeys.detail(assetId),
    queryFn: () => recordApi.get({ assetId }),
  });
}

export function useSuspenseRecordQuery(assetId: string) {
  return useSuspenseQuery(recordQueryOptions(assetId));
}
