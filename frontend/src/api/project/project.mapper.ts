import type { ProjectSummary } from "@/model";

import type {
  CreateProjectRequest,
  ProjectDto,
  ProjectGameType,
  ProjectPlatformType,
  UpdateProjectRequest,
} from "./project.contract";

export function toProjectSummary(project: ProjectDto): ProjectSummary {
  return {
    id: String(project.id),
    name: project.name,
    gameType: project.gameType,
    platform: project.targetPlatform,
    description: project.description,
    style: project.style,
    visualStyle: project.style,
    // These fields are currently not provided by core-api.
    visualDirection: "",
    assetCount: 0,
  };
}

export function toCreateProjectRequest(
  project: ProjectSummary,
  userID: number,
): CreateProjectRequest {
  return { userID, ...toProjectPayload(project) };
}

export function toUpdateProjectRequest(
  project: ProjectSummary,
): UpdateProjectRequest {
  const projectID = Number(project.id);
  if (!Number.isSafeInteger(projectID) || projectID <= 0) {
    throw new Error("A real project ID is required to update core-api.");
  }
  return { projectID, ...toProjectPayload(project) };
}

function toProjectPayload(project: ProjectSummary) {
  return {
    name: project.name,
    gameType: toGameType(project.gameType),
    // The current UI does not expose these core-api fields yet.
    viewType: "Other" as const,
    targetPlatform: toPlatform(project.platform),
    description: project.description,
    reference: "",
    style: project.visualStyle || project.style,
  };
}

function toGameType(value: string): ProjectGameType {
  return value === "RPG" || value === "ACT" || value === "SLG" ? value : "Other";
}

function toPlatform(value: string): ProjectPlatformType {
  return value === "PC" || value === "Mobile" || value === "Web" ? value : "PC";
}
