/**
 * Transport contract for core-api's ProjectRouter.
 *
 * Keep these types separate from `ProjectSummary`: the latter contains UI-only
 * fields (for example `assetCount` and `visualDirection`) that core-api does
 * not currently persist.
 */
export type ProjectGameType = "RPG" | "ACT" | "SLG" | "Other";
export type ProjectViewType = "TopDown" | "SideView" | "Isometric" | "Other";
export type ProjectPlatformType = "PC" | "Mobile" | "Web";

export type ProjectDto = {
  userID: number;
  id: number;
  name: string;
  gameType: ProjectGameType;
  viewType: ProjectViewType;
  targetPlatform: ProjectPlatformType;
  description: string;
  reference: string;
  style: string;
};

export type CreateProjectRequest = Omit<ProjectDto, "id">;
export type CreateProjectResponse = { id: number };
export type ListProjectsRequest = { userID: number };
export type ListProjectsResponse = { projects: ProjectDto[] };
export type ProjectDetailRequest = { projectID: number };
export type ProjectDetailResponse = { project: ProjectDto };

/** Only supplied fields are changed by core-api. */
export type UpdateProjectRequest = {
  projectID: number;
  name?: string;
  gameType?: ProjectGameType;
  viewType?: ProjectViewType;
  targetPlatform?: ProjectPlatformType;
  description?: string;
  reference?: string;
  style?: string;
};
export type UpdateProjectResponse = { success: boolean };
export type DeleteProjectRequest = { projectID: number };
export type DeleteProjectResponse = { success: boolean };

export const projectEndpoints = {
  create: "/project/create",
  list: "/project/list",
  detail: "/project/detail",
  update: "/project/update",
  delete: "/project/delete",
} as const;

export type ProjectRequestInput = {
  path: string;
  method: "GET" | "POST";
  /** GET parameters; POST requests send this value as JSON. */
  data: Record<string, unknown>;
};

export type ProjectRequestExecutor = <TResponse>(
  input: ProjectRequestInput,
) => Promise<TResponse>;

export type ProjectBackendApi = {
  create: (request: CreateProjectRequest) => Promise<CreateProjectResponse>;
  list: (request: ListProjectsRequest) => Promise<ListProjectsResponse>;
  detail: (request: ProjectDetailRequest) => Promise<ProjectDetailResponse>;
  update: (request: UpdateProjectRequest) => Promise<UpdateProjectResponse>;
  delete: (request: DeleteProjectRequest) => Promise<DeleteProjectResponse>;
};

/**
 * Creates the CRUD client without coupling it to a particular auth or response
 * envelope implementation. Supply the app-wide HTTP executor when core-api is
 * connected.
 */
export function createProjectBackendApi(
  request: ProjectRequestExecutor,
): ProjectBackendApi {
  return {
    create: (data) => request({ path: projectEndpoints.create, method: "POST", data }),
    list: (data) => request({ path: projectEndpoints.list, method: "GET", data }),
    detail: (data) => request({ path: projectEndpoints.detail, method: "GET", data }),
    update: (data) => request({ path: projectEndpoints.update, method: "POST", data }),
    delete: (data) => request({ path: projectEndpoints.delete, method: "POST", data }),
  };
}
