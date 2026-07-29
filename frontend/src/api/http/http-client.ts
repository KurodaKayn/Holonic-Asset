import { DataApiError } from "@/lib/data-api-error";

export type HttpRequest = {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** GET parameters; other methods send this value as JSON. */
  data?: Record<string, unknown>;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || window.location.origin;

/** Sends a JSON request to the configured backend. */
export async function httpRequest<TResponse>({
  path,
  method,
  data,
}: HttpRequest): Promise<TResponse> {
  const url = new URL(path, `${apiBaseUrl.replace(/\/$/, "")}/`);
  const init: RequestInit = { method, headers: { Accept: "application/json" } };

  if (method === "GET") {
    for (const [key, value] of Object.entries(data ?? {})) {
      url.searchParams.set(key, String(value));
    }
  } else if (data) {
    init.headers = { ...init.headers, "Content-Type": "application/json" };
    init.body = JSON.stringify(data);
  }

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    throw new DataApiError("UNAVAILABLE", "Unable to reach the API.", error);
  }

  const body: unknown = await response.json().catch(() => undefined);
  if (!response.ok) {
    throw new DataApiError(
      response.status === 404 ? "NOT_FOUND" : "UNKNOWN",
      `API request failed (${response.status}).`,
      body,
    );
  }
  return body as TResponse;
}
