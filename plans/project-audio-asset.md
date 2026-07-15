# Project audio asset

## Context

Promote audio to a top-level product workspace without forcing the existing image asset detail model to represent media-specific controls. Project creation can still pass its context into the standalone Audio route.

## Layout

```text
| Audio list   | Audio workspace                                      |
|              | Back / asset name                         Generated  |
|              |                                                    |
|              |       generated clip  [move / resize]              |
|              |            imported clip  [move / resize]          |
|              |       0:00   progress                 duration      |
|              |       play   loop   speed   stretch multiplier     |
```

## Approach

- Add `audio` to the creatable asset types and toolbar, while keeping image-only filters unchanged.
- Use a minimal Audio form: name, creative brief, and inherited project context.
- Add a top-level `/audio` route and navigation tab with an Audio work list in the left sidebar.
- Keep top-level Audio and Project-created Audio as separate entry flows.
- Route Project creation to `/project/audio/new` with Project context while sharing the editor implementation with `/audio`.
- Generate a local WAV demo clip in the browser so playback controls are functional without a backend.
- Implement play/pause, seeking, loop, speed presets, and draggable waveform edges.
- Map stretch duration inversely to playback rate: `2x length = 0.5x speed`, `0.5x length = 2x speed`.
- Accept one or more MP3 files dropped over the center editor and create an independent timeline track for each file.
- Give every track its own offset, stretch/speed, loop, mute, preview, and delete controls.
- Give every track an independent 0-100% volume fader, with quick mute as a separate state.
- Add master volume, mute, loop, and playback speed to the complete-mix transport; final gain is track volume multiplied by master volume.
- Use a shared 30-second transport only for previewing the complete mix; clips play together only where their timeline ranges overlap.

## Verification

- Open Create Audio from a project and submit the form.
- Verify project sidebar remains available and the correct project context is shown.
- Verify playback, seeking, looping, speed selection, and both resize handles.
- Drop MP3 files and verify clips can be separated, partially overlapped, or completely overlapped.
- Run formatting, lint, and production build.
