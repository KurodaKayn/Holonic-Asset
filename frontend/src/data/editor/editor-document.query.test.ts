import { QueryClient } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";

import { editorDocumentApi } from "@/data/editor/editor-document.api";
import { editorDocumentQueryOptions } from "@/data/editor/editor-document.query";
import { editorKeys } from "@/data/editor/editor.keys";
import type { EditorDocumentData } from "@/types/editor-document";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("editor document query", () => {
  it("caches a document by its project and asset identifiers", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const data: EditorDocumentData = {
      projectName: "Moonlit Orchard",
      asset: {
        id: "forager-hero",
        projectId: "moonlit-orchard",
        kind: "character",
        name: "Forager Hero",
        version: "v4",
        history: [],
      },
      document: { prompt: "Keep the silhouette." },
    };
    vi.spyOn(editorDocumentApi, "getDocument").mockResolvedValue(data);

    const result = await queryClient.fetchQuery(
      editorDocumentQueryOptions("moonlit-orchard", "forager-hero"),
    );

    expect(result).toEqual(data);
    expect(
      queryClient.getQueryData(
        editorKeys.document("moonlit-orchard", "forager-hero"),
      ),
    ).toEqual(data);
  });
});
