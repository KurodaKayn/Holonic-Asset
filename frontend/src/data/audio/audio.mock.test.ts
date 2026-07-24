import { afterEach, describe, expect, it } from "vitest";

import {
  addMockAudioTrack,
  deleteMockAudioTrack,
  generateMockAudioVariation,
  listMockAudioTracks,
  resetAudioMockData,
  updateMockAudioTrack,
} from "@/data/audio/audio.mock";

const withoutDelay = { delayMs: 0 };

afterEach(() => {
  resetAudioMockData();
});

describe("audio mock API", () => {
  it("returns isolated copies of the seeded tracks", async () => {
    const first = await listMockAudioTracks(withoutDelay);
    first[0].name = "changed-in-consumer.wav";

    const second = await listMockAudioTracks(withoutDelay);

    expect(second).toHaveLength(3);
    expect(second[0]?.name).toBe("orchard-ambience.wav");
  });

  it("adds, updates, and deletes a track", async () => {
    const added = await addMockAudioTrack(
      {
        name: "  rain-reference.mp3  ",
        offset: 8,
        length: 20,
        tone: "rose",
        muted: false,
        loop: false,
      },
      withoutDelay,
    );
    const updated = await updateMockAudioTrack(
      {
        trackId: added.id,
        patch: { muted: true, loop: true },
      },
      withoutDelay,
    );

    expect(added.name).toBe("rain-reference.mp3");
    expect(updated).toMatchObject({ muted: true, loop: true });

    await deleteMockAudioTrack(added.id, withoutDelay);

    await expect(listMockAudioTracks(withoutDelay)).resolves.toHaveLength(3);
  });

  it("generates a variation that fits the timeline", async () => {
    const generated = await generateMockAudioVariation(
      { prompt: "A quiet rain loop", duration: 60 },
      withoutDelay,
    );

    expect(generated).toMatchObject({
      name: "generated-variation-1.wav",
      length: 60,
      muted: false,
      loop: false,
    });
    expect(generated.offset + generated.length).toBeLessThanOrEqual(90);
  });

  it("returns consistent domain errors", async () => {
    await expect(
      updateMockAudioTrack(
        { trackId: "missing", patch: { muted: true } },
        withoutDelay,
      ),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(
      generateMockAudioVariation({ prompt: "   ", duration: 30 }, withoutDelay),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("resets runtime changes between tests", async () => {
    await deleteMockAudioTrack("orchard", withoutDelay);
    resetAudioMockData();

    await expect(listMockAudioTracks(withoutDelay)).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "orchard" })]),
    );
  });
});
