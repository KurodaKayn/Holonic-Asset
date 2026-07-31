import type { AssetKind } from "./asset-kind";
import type { AssetRevision, AssetRevisionStatus } from "./asset-revision";

export type Asset = {
  id: string;
  name: string;
  kind: AssetKind;
  version: string;
  size: string;
  description: string;
  tags: string[];
  accent: string;
};

export type AssetAnimation = {
  id: string;
  name: string;
  frameCount: number;
  status: AssetRevisionStatus;
};

export type SceneryLayer = {
  id: string;
  label: string;
  detail: string;
  imageUrl: string;
  blendMode: "normal" | "multiply";
};

export type SceneryAssetData = { layers: SceneryLayer[] };

export type ProjectAsset = {
  id: string;
  name: string;
  description: string;
  previewImageUrl?: string;
  previewFrame?: {
    columns: number;
    rows: number;
    column: number;
    row: number;
    frameWidth?: number;
    frameHeight?: number;
    offsetX?: number;
    displayWidth?: string;
  };
  previewCrop?: {
    sourceWidth: number;
    sourceHeight: number;
    x: number;
    y: number;
    width: number;
    height: number;
    displayOffsetY?: string;
  };
  previewOffset?: { x: string; y: string };
  previewScale?: number;
  version: string;
  canvasSize: string;
  perspective: string;
  tags: string[];
  history: AssetRevision[];
  animations: AssetAnimation[];
  scenery?: SceneryAssetData;
};
