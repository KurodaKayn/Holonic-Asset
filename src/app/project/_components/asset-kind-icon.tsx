import { Box, Grid3X3, Map, PanelsTopLeft, UserRound, Volume2 } from "lucide-react";
import type { ComponentProps } from "react";

import type { CreatableAssetKind } from "../_data/project-demo-data";

export function AssetKindIcon({
  kind,
  ...props
}: { kind: CreatableAssetKind } & ComponentProps<typeof UserRound>) {
  const Icon = {
    character: UserRound,
    object: Box,
    tiles: Grid3X3,
    map: Map,
    ui: PanelsTopLeft,
    audio: Volume2,
  }[kind];

  return <Icon {...props} />;
}
