import { useNavigate, useParams } from "@tanstack/react-router";

import { AssetEditor } from "@/features/asset-editor";

export function EditorPage() {
  const { assetId, projectId } = useParams({
    from: "/projects/$projectId/assets/$assetId",
  });
  const navigate = useNavigate({
    from: "/projects/$projectId/assets/$assetId",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AssetEditor
        assetId={assetId}
        onExitEditor={() =>
          void navigate({
            to: "/projects",
            search: { project: projectId, q: "" },
          })
        }
      />
    </div>
  );
}
