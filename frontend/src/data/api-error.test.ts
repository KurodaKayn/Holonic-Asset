import { describe, expect, it } from "vitest";

import { DataApiError, dataApiErrorCodes } from "@/data/api-error";

describe("DataApiError", () => {
  it("exposes a stable code, message, and optional details", () => {
    const details = { assetId: "missing-asset" };
    const error = new DataApiError(
      "NOT_FOUND",
      "Asset was not found.",
      details,
    );

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("DataApiError");
    expect(error.code).toBe("NOT_FOUND");
    expect(error.message).toBe("Asset was not found.");
    expect(error.details).toBe(details);
  });

  it("publishes the supported error codes", () => {
    expect(dataApiErrorCodes).toEqual([
      "BAD_REQUEST",
      "NOT_FOUND",
      "CONFLICT",
      "UNAVAILABLE",
      "UNKNOWN",
    ]);
  });
});
