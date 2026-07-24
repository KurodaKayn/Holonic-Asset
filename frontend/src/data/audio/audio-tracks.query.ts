import { queryOptions, useQuery } from "@tanstack/react-query";

import { audioApi } from "@/data/audio/audio.api";
import { audioKeys } from "@/data/audio/audio.keys";

export function audioTracksQueryOptions() {
  return queryOptions({
    queryKey: audioKeys.tracks(),
    queryFn: audioApi.listTracks,
  });
}

export function useAudioTracksQuery() {
  return useQuery(audioTracksQueryOptions());
}
