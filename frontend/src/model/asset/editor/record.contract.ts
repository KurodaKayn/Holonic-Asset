import type {
  EditorRecord,
  EditorWorkspaceData,
} from "@/features/asset-editor";
import type { AssetRevision } from "@/features/assets";

export type GetEditorRecordInput = {
  assetId: string;
};

export type SaveEditorRecordInput = {
  projectId: string;
  assetId: string;
  record: EditorRecord;
};

export type EditorRecordSaveResult = {
  projectId: string;
  assetId: string;
  record: EditorRecord;
  version: string;
  history: AssetRevision[];
};

export type EditorRecordApi = {
  get: (input: GetEditorRecordInput) => Promise<EditorWorkspaceData>;
  saveRevision: (
    input: SaveEditorRecordInput,
  ) => Promise<EditorRecordSaveResult>;
};
