import {
  createMockProject,
  deleteMockProject,
  listMockProjects,
  updateMockProject,
} from "./mock";
import { deleteMockProjectAssets } from "../asset/library/mock";
import { deleteMockProjectGenerationRuns } from "../generation/run/mock";
import { DataApiError } from "@/lib/data-api-error";
import type { ProjectSummary } from "@/model";
import { createProjectBackendApi } from "./project.contract";
import { getProjectApiConfig, createProjectHttpExecutor } from "./project.http";
import {
  toCreateProjectRequest,
  toProjectSummary,
  toUpdateProjectRequest,
} from "./project.mapper";

const projectApiConfig = getProjectApiConfig();
const projectUserId = Number(import.meta.env.VITE_PROJECT_USER_ID);
const projectBackendApi = projectApiConfig
  ? createProjectBackendApi(createProjectHttpExecutor(projectApiConfig))
  : undefined;

function requireProjectUserId() {
  if (!Number.isSafeInteger(projectUserId) || projectUserId <= 0) {
    throw new DataApiError(
      "BAD_REQUEST",
      "VITE_PROJECT_USER_ID must be a positive integer when core-api is enabled.",
    );
  }
  return projectUserId;
}

export const projectApi = {
  list: async (): Promise<ProjectSummary[]> => {
    if (!projectBackendApi) return listMockProjects();
    const response = await projectBackendApi.list({ userID: requireProjectUserId() });
    return response.projects.map(toProjectSummary);
  },
  create: async (project: ProjectSummary) => {
    if (!projectBackendApi) return createMockProject(project);
    const response = await projectBackendApi.create(
      toCreateProjectRequest(project, requireProjectUserId()),
    );
    if (!Number.isSafeInteger(response.id) || response.id <= 0) {
      throw new DataApiError(
        "UNKNOWN",
        "core-api returned no project ID after creation.",
        response,
      );
    }
    return { ...project, id: String(response.id) };
  },
  update: async (project: ProjectSummary) => {
    if (!projectBackendApi) return updateMockProject(project);
    const response = await projectBackendApi.update(toUpdateProjectRequest(project));
    if (!response.success) {
      throw new DataApiError("UNKNOWN", "core-api did not confirm the project update.");
    }
    return project;
  },
  delete: async (projectId: string) => {
    if (projectBackendApi) {
      const numericProjectId = Number(projectId);
      if (!Number.isSafeInteger(numericProjectId) || numericProjectId <= 0) {
        throw new DataApiError("BAD_REQUEST", "A real project ID is required to delete core-api data.");
      }
      const response = await projectBackendApi.delete({ projectID: numericProjectId });
      if (!response.success) {
        throw new DataApiError("UNKNOWN", "core-api did not confirm the project deletion.");
      }
      return;
    }
    await deleteMockProject(projectId);
    deleteMockProjectAssets(projectId);
    deleteMockProjectGenerationRuns(projectId);
  },
};
