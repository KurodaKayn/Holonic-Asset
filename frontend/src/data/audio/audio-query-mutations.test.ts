import { QueryClient, type MutationOptions } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";

import { audioApi } from "@/data/audio/audio.api";
import { audioKeys } from "@/data/audio/audio.keys";
import {
  addAudioTrackMutationOptions,
  deleteAudioTrackMutationOptions,
  generateAudioVariationMutationOptions,
  updateAudioTrackMutationOptions,
} from "@/data/audio/audio-track.mutations";
import { audioTracksQueryOptions } from "@/data/audio/audio-tracks.query";
import type { AudioTrack } from "@/types/audio";

const firstTrack: AudioTrack = {
  id: "first",
  name: "first.wav",
  offset: 0,
  length: 20,
  tone: "mint",
  muted: false,
  loop: false,
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("audio React Query integration", () => {
  it("loads tracks under the shared audio query key", async () => {
    const queryClient = createTestQueryClient();
    vi.spyOn(audioApi, "listTracks").mockResolvedValue([firstTrack]);

    const result = await queryClient.fetchQuery(audioTracksQueryOptions());

    expect(result).toEqual([firstTrack]);
    expect(queryClient.getQueryData(audioKeys.tracks())).toEqual([firstTrack]);
  });

  it("keeps the track cache synchronized after mutations", async () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData<AudioTrack[]>(audioKeys.tracks(), [firstTrack]);

    const addedTrack = { ...firstTrack, id: "added", name: "added.wav" };
    vi.spyOn(audioApi, "addTrack").mockResolvedValue(addedTrack);
    await executeMutation(
      queryClient,
      addAudioTrackMutationOptions(queryClient),
      {
        name: addedTrack.name,
        offset: addedTrack.offset,
        length: addedTrack.length,
        tone: addedTrack.tone,
        muted: addedTrack.muted,
        loop: addedTrack.loop,
      },
    );

    const updatedTrack = { ...firstTrack, muted: true };
    vi.spyOn(audioApi, "updateTrack").mockResolvedValue(updatedTrack);
    await executeMutation(
      queryClient,
      updateAudioTrackMutationOptions(queryClient),
      { trackId: firstTrack.id, patch: { muted: true } },
    );

    const generatedTrack = {
      ...firstTrack,
      id: "generated",
      name: "generated.wav",
    };
    vi.spyOn(audioApi, "generateVariation").mockResolvedValue(generatedTrack);
    await executeMutation(
      queryClient,
      generateAudioVariationMutationOptions(queryClient),
      { prompt: "Generate rain", duration: 30 },
    );

    vi.spyOn(audioApi, "deleteTrack").mockResolvedValue();
    await executeMutation(
      queryClient,
      deleteAudioTrackMutationOptions(queryClient),
      addedTrack.id,
    );

    expect(queryClient.getQueryData(audioKeys.tracks())).toEqual([
      updatedTrack,
      generatedTrack,
    ]);
  });
});

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function executeMutation<TData, TVariables>(
  queryClient: QueryClient,
  options: MutationOptions<TData, Error, TVariables, unknown>,
  variables: TVariables,
) {
  return queryClient
    .getMutationCache()
    .build<TData, Error, TVariables, unknown>(queryClient, options)
    .execute(variables);
}
