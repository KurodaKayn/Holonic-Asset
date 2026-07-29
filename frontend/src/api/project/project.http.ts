import { DataApiError } from "@/lib/data-api-error";

import type { ProjectRequestExecutor, ProjectRequestInput } from "./project.contract";

type ProjectApiConfig = {
  baseUrl: string;
};

export function getProjectApiConfig(): ProjectApiConfig | undefined {
  const baseUrl = import.meta.env.VITE_CORE_API_BASE_URL?.trim();
  return baseUrl ? { baseUrl: baseUrl.replace(/\/$/, "") } : undefined;
}

/** Executes core-api's unwrapped JSON responses produced by echox.WrapReq. */
export function createProjectHttpExecutor(
  config: ProjectApiConfig,
): ProjectRequestExecutor {
  return async <TResponse>({ path, method, data }: ProjectRequestInput) => {
    const url = new URL(path, `${config.baseUrl}/`);
    const init: RequestInit = { method, headers: { Accept: "application/json" } };

    if (method === "GET") {
      for (const [key, value] of Object.entries(data)) {
        url.searchParams.set(key, String(value));
      }
    } else {
      init.headers = { ...init.headers, "Content-Type": "application/json" };
      init.body = JSON.stringify(data);
    }

    let response: Response;
    try {
      response = await fetch(url, init);
    } catch (error) {
      throw new DataApiError("UNAVAILABLE", "Unable to reach core-api.", error);
    }

    const body: unknown = await response.json().catch(() => undefined);
    if (!response.ok) {
      throw new DataApiError(
        response.status === 404 ? "NOT_FOUND" : "UNKNOWN",
        `Project request failed (${response.status}).`,
        body,
      );
    }
    return body as TResponse;
  };
}
