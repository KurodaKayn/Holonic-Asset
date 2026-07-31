import { createFileRoute, redirect } from "@tanstack/react-router";

import { recordQueryOptions } from "@/model";
import { EditorPage } from "@/pages/projects/asset/editor-page";

export const Route = createFileRoute("/projects/$projectId/assets/$assetId")({
  loader: async ({
    context: { queryClient },
    params: { assetId, projectId },
  }) => {
    const data = await queryClient.ensureQueryData(recordQueryOptions(assetId));

    if (data.asset.projectId !== projectId) {
      throw redirect({
        to: "/projects/$projectId/assets/$assetId",
        params: { projectId: data.asset.projectId, assetId },
        search: { project: data.asset.projectId, q: "" },
        replace: true,
      });
    }

    return data;
  },
  component: EditorPage,
});
