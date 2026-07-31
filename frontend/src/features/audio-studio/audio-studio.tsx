import { AudioStudioWorkspace } from "./audio-studio-workspace";
import { useAudioStudio } from "./state/use-audio-studio";

export function AudioStudio() {
  const studio = useAudioStudio();

  return <AudioStudioWorkspace studio={studio} />;
}
