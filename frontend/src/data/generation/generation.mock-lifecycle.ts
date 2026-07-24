import { completeMockGeneration } from "./generation.mock";
import {
  createMockGenerationRun,
  removeMockGenerationRun,
  updateMockGenerationRun,
} from "./generation-run.mock";
import { addMockAsset, hasMockProject } from "@/data/project/project-asset.mock";
import { createGenerationLifecycle } from "@/data/generation/generation-lifecycle";

export const mockGenerationLifecycle = createGenerationLifecycle({
  createRun: createMockGenerationRun,
  updateRun: updateMockGenerationRun,
  removeRun: removeMockGenerationRun,
  completeGeneration: completeMockGeneration,
  hasProject: hasMockProject,
  addAsset: addMockAsset,
});
