export const recordKeys = {
  all: ["record"] as const,
  detail: (assetId: string) => [...recordKeys.all, "detail", assetId] as const,
};
