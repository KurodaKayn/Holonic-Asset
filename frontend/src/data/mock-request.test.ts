import { describe, expect, it } from "vitest";

import { DataApiError } from "@/data/api-error";
import { runMockRequest } from "@/data/mock-request";

describe("runMockRequest", () => {
  it("resolves synchronous and asynchronous operations", async () => {
    await expect(runMockRequest(() => "ready", { delayMs: 0 })).resolves.toBe(
      "ready",
    );
    await expect(
      runMockRequest(async () => "generated", { delayMs: 0 }),
    ).resolves.toBe("generated");
  });

  it("preserves known data API errors", async () => {
    const error = new DataApiError("NOT_FOUND", "Project was not found.");

    await expect(
      runMockRequest(
        () => {
          throw error;
        },
        { delayMs: 0 },
      ),
    ).rejects.toBe(error);
  });

  it("normalizes unknown failures", async () => {
    const request = runMockRequest(
      () => {
        throw new Error("Internal mock detail");
      },
      { delayMs: 0 },
    );

    await expect(request).rejects.toMatchObject({
      name: "DataApiError",
      code: "UNKNOWN",
      message: "Mock request failed.",
    });
  });

  it("rejects invalid delays", async () => {
    await expect(
      runMockRequest(() => undefined, { delayMs: -1 }),
    ).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });
});
