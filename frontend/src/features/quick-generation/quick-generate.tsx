import { QuickGenerationWorkspace } from "./quick-generation-workspace";
import { useQuickGeneration } from "./state";

export function QuickGenerate() {
  const generation = useQuickGeneration();

  return <QuickGenerationWorkspace generation={generation} />;
}
