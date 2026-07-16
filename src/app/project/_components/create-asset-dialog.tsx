"use client";

import { ArrowDown, ArrowUp, FileAudio, ImagePlus, Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

import type { CreatableAssetKind, ProjectSummary } from "../_data/project-demo-data";

const labels: Record<CreatableAssetKind, string> = {
  character: "Character",
  object: "Object",
  tiles: "Tiles",
  map: "Map",
  ui: "UI",
  audio: "Audio",
};
const AUDIO_STYLES = [
  "Ambient",
  "Cinematic",
  "Electronic",
  "Orchestral",
  "Rock",
  "Lo-fi",
  "Custom",
];
const AUDIO_DURATIONS = ["15", "30", "60", "120", "180"];
const AUDIO_MIME_TYPES = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/x-m4a"];
const ASPECT_RATIOS = ["1:1", "4:3", "16:9", "9:16", "21:9"];
const UI_COMPONENT_TYPES = ["Button", "Card", "Panel", "Navigation", "Dialog", "HUD", "Custom"];

type UiComponent = {
  id: number;
  type: string;
  name: string;
  description: string;
};

export type CreationRequest = {
  kind: CreatableAssetKind;
  name: string;
  prompt: string;
  canvasSize: string;
};

export function CreateAssetDialog({
  children,
  initialPrompt = "",
  onCreate,
  project,
}: {
  children: (openDialog: (kind: CreatableAssetKind) => void) => React.ReactNode;
  initialPrompt?: string;
  onCreate: (request: CreationRequest) => void;
  project: ProjectSummary;
}) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<CreatableAssetKind>("character");
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [canvasSize, setCanvasSize] = useState("32 × 32 px");
  const [perspective, setPerspective] = useState("Top-down");
  const [directionCount, setDirectionCount] = useState("4");
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referenceError, setReferenceError] = useState("");
  const [useProjectContext, setUseProjectContext] = useState(true);
  const [audioStyle, setAudioStyle] = useState("Ambient");
  const [customStyle, setCustomStyle] = useState("");
  const [duration, setDuration] = useState("60");
  const [instrumental, setInstrumental] = useState(true);
  const [lyrics, setLyrics] = useState("");
  const [voice, setVoice] = useState("Male");
  const [audioReferenceFile, setAudioReferenceFile] = useState<File | null>(null);
  const [audioReferenceError, setAudioReferenceError] = useState("");
  const [voiceReferenceFile, setVoiceReferenceFile] = useState<File | null>(null);
  const [voiceReferenceError, setVoiceReferenceError] = useState("");
  const [mapType, setMapType] = useState<"scenery" | "tiles">("scenery");
  const [layerCount, setLayerCount] = useState(3);
  const [layers, setLayers] = useState(["", "", ""]);
  const [tileCount, setTileCount] = useState(3);
  const [tileDescriptions, setTileDescriptions] = useState(["", "", ""]);
  const [sceneryStyle, setSceneryStyle] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [uiStyle, setUiStyle] = useState("");
  const [uiComponents, setUiComponents] = useState<UiComponent[]>([
    { id: 1, type: "Panel", name: "", description: "" },
  ]);
  const [nextComponentId, setNextComponentId] = useState(2);
  const referenceInputRef = useRef<HTMLInputElement>(null);
  const audioReferenceInputRef = useRef<HTMLInputElement>(null);
  const voiceReferenceInputRef = useRef<HTMLInputElement>(null);
  const referenceUrl = useMemo(
    () => (referenceFile ? URL.createObjectURL(referenceFile) : ""),
    [referenceFile],
  );

  useEffect(() => {
    return () => {
      if (referenceUrl) URL.revokeObjectURL(referenceUrl);
    };
  }, [referenceUrl]);

  const resetForm = (nextPrompt = "") => {
    setName("");
    setPrompt(nextPrompt);
    setCanvasSize("32 × 32 px");
    setPerspective("Top-down");
    setDirectionCount("4");
    setReferenceFile(null);
    setReferenceError("");
    setUseProjectContext(true);
    setAudioStyle("Ambient");
    setCustomStyle("");
    setDuration("60");
    setInstrumental(true);
    setLyrics("");
    setVoice("Male");
    setAudioReferenceFile(null);
    setAudioReferenceError("");
    setVoiceReferenceFile(null);
    setVoiceReferenceError("");
    setMapType("scenery");
    setLayerCount(3);
    setLayers(["", "", ""]);
    setTileCount(3);
    setTileDescriptions(["", "", ""]);
    setSceneryStyle("");
    setAspectRatio("16:9");
    setUiStyle("");
    setUiComponents([{ id: 1, type: "Panel", name: "", description: "" }]);
    setNextComponentId(2);
    if (referenceInputRef.current) referenceInputRef.current.value = "";
    if (audioReferenceInputRef.current) audioReferenceInputRef.current.value = "";
    if (voiceReferenceInputRef.current) voiceReferenceInputRef.current.value = "";
  };

  const openDialog = (nextKind: CreatableAssetKind) => {
    setKind(nextKind);
    resetForm(initialPrompt.trim());
    if (nextKind === "tiles") setCanvasSize("16 × 16 px");
    setOpen(true);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetForm();
  };

  const handleReferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setReferenceFile(null);
      setReferenceError("Choose a PNG, JPG, or WebP image.");
      event.target.value = "";
      return;
    }
    setReferenceFile(file);
    setReferenceError("");
  };

  const removeReference = () => {
    setReferenceFile(null);
    setReferenceError("");
    if (referenceInputRef.current) referenceInputRef.current.value = "";
  };

  const handleAudioFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    setError: (error: string) => void,
  ) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    if (!AUDIO_MIME_TYPES.includes(file.type)) {
      setFile(null);
      setError("Choose an MP3, WAV, or M4A audio file.");
      event.target.value = "";
      return;
    }
    setFile(file);
    setError("");
  };

  const resizeDescriptions = (
    nextCount: number,
    setCount: (count: number) => void,
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    const count = Math.max(1, Math.min(12, Number.isFinite(nextCount) ? nextCount : 1));
    setCount(count);
    setItems((current) => Array.from({ length: count }, (_, index) => current[index] ?? ""));
  };

  const updateUiComponent = (id: number, update: Partial<UiComponent>) => {
    setUiComponents((current) =>
      current.map((component) => (component.id === id ? { ...component, ...update } : component)),
    );
  };

  const moveUiComponent = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= uiComponents.length) return;
    setUiComponents((current) => {
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const creationPrompt =
      kind === "audio"
        ? instrumental || audioStyle === "Custom"
          ? customStyle.trim()
          : audioStyle
        : prompt.trim();
    onCreate({ kind, name: name.trim(), prompt: creationPrompt, canvasSize });
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children(openDialog)}
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create {labels[kind]}</DialogTitle>
          <DialogDescription>
            Set the production details for this {labels[kind].toLowerCase()}. Project defaults will
            guide its {kind === "audio" ? "tone and atmosphere" : "visual style"}.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-medium">
            Asset name
            <Input
              required
              placeholder={
                kind === "audio"
                  ? "e.g. Orchard at Night"
                  : `e.g. ${kind === "character" ? "Orchard Keeper" : "Moonlit Lantern"}`
              }
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          {kind === "character" || kind === "object" || kind === "tiles" ? (
            <label className="grid gap-2 text-sm font-medium">
              Creative brief
              <Textarea
                required
                className="min-h-24 resize-y"
                placeholder="Describe the subject, material, mood, and details to generate..."
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
              />
            </label>
          ) : null}

          {kind === "character" || kind === "object" ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2 text-sm font-medium">
                <label htmlFor={`${kind}-canvas-size`}>Canvas size</label>
                <NativeSelect
                  id={`${kind}-canvas-size`}
                  className="w-full"
                  required
                  value={canvasSize}
                  onChange={(event) => setCanvasSize(event.target.value)}
                >
                  {["16 × 16 px", "32 × 32 px", "64 × 64 px", "128 × 128 px"].map((size) => (
                    <NativeSelectOption key={size} value={size}>
                      {size}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <div className="grid gap-2 text-sm font-medium">
                <label htmlFor={`${kind}-perspective`}>Perspective</label>
                <NativeSelect
                  id={`${kind}-perspective`}
                  className="w-full"
                  required
                  value={perspective}
                  onChange={(event) => setPerspective(event.target.value)}
                >
                  <NativeSelectOption value="Top-down">Top down</NativeSelectOption>
                  <NativeSelectOption value="Side-on">Side on</NativeSelectOption>
                  <NativeSelectOption value="Isometric">Isometric</NativeSelectOption>
                </NativeSelect>
              </div>
              <div className="grid gap-2 text-sm font-medium">
                <label htmlFor={`${kind}-direction-count`}>Direction count</label>
                <NativeSelect
                  id={`${kind}-direction-count`}
                  className="w-full"
                  required
                  value={directionCount}
                  onChange={(event) => setDirectionCount(event.target.value)}
                >
                  <NativeSelectOption value="1">1 direction</NativeSelectOption>
                  <NativeSelectOption value="4">4 directions</NativeSelectOption>
                  <NativeSelectOption value="8">8 directions</NativeSelectOption>
                </NativeSelect>
              </div>
            </div>
          ) : kind === "tiles" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Canvas size
                <Input value={canvasSize} onChange={(event) => setCanvasSize(event.target.value)} />
              </label>
              <div className="grid gap-2 text-sm font-medium">
                <label htmlFor="create-asset-perspective">Perspective</label>
                <NativeSelect id="create-asset-perspective" className="w-full">
                  <NativeSelectOption>Top-down</NativeSelectOption>
                  <NativeSelectOption>Side-on</NativeSelectOption>
                  <NativeSelectOption>Isometric</NativeSelectOption>
                </NativeSelect>
              </div>
            </div>
          ) : null}

          {kind === "character" || kind === "object" ? (
            <div className="grid gap-2">
              <div className="text-sm font-medium">Reference</div>
              <input
                ref={referenceInputRef}
                className="sr-only"
                id={`${kind}-reference`}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleReferenceChange}
              />
              {referenceFile && referenceUrl ? (
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Image
                    src={referenceUrl}
                    alt={`Selected ${kind} reference`}
                    width={56}
                    height={56}
                    unoptimized
                    className="size-14 rounded-md object-cover outline outline-1 -outline-offset-1 outline-black/10"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{referenceFile.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {labels[kind]} reference image
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Remove reference image"
                    onClick={removeReference}
                  >
                    <X />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor={`${kind}-reference`}
                  className="flex min-h-20 cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-3 transition-colors hover:bg-muted/50 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50"
                >
                  <ImagePlus className="size-5 text-muted-foreground" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-medium">Choose a reference image</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      PNG, JPG, or WebP · one image
                    </span>
                  </span>
                </label>
              )}
              {referenceError ? (
                <p className="text-xs text-destructive" role="alert">
                  {referenceError}
                </p>
              ) : null}
            </div>
          ) : null}

          {kind === "map" ? (
            <>
              <div className="grid gap-2 text-sm font-medium">
                <label htmlFor="map-type">Map type</label>
                <NativeSelect
                  id="map-type"
                  className="w-full"
                  value={mapType}
                  onChange={(event) => setMapType(event.target.value as "scenery" | "tiles")}
                >
                  <NativeSelectOption value="scenery">Scenery</NativeSelectOption>
                  <NativeSelectOption value="tiles">Tiles</NativeSelectOption>
                </NativeSelect>
              </div>

              {mapType === "scenery" ? (
                <>
                  <label className="grid gap-2 text-sm font-medium">
                    Style
                    <Textarea
                      required
                      className="min-h-20 resize-y"
                      placeholder="Describe the overall scene style..."
                      value={sceneryStyle}
                      onChange={(event) => setSceneryStyle(event.target.value)}
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium">
                      Layer num
                      <Input
                        required
                        type="number"
                        min="1"
                        max="12"
                        value={layerCount}
                        onChange={(event) =>
                          resizeDescriptions(Number(event.target.value), setLayerCount, setLayers)
                        }
                      />
                    </label>
                    <div className="grid gap-2 text-sm font-medium">
                      <label htmlFor="scenery-aspect-ratio">Aspect ratio</label>
                      <NativeSelect
                        id="scenery-aspect-ratio"
                        className="w-full"
                        value={aspectRatio}
                        onChange={(event) => setAspectRatio(event.target.value)}
                      >
                        {ASPECT_RATIOS.map((ratio) => (
                          <NativeSelectOption key={ratio} value={ratio}>
                            {ratio}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>
                    </div>
                  </div>
                  <DescriptionList label="Layers" descriptions={layers} onChange={setLayers} />
                  <ImageReferenceField id="scenery-reference" label="Reference" />
                </>
              ) : (
                <>
                  <label className="grid gap-2 text-sm font-medium">
                    Tile num
                    <Input
                      required
                      type="number"
                      min="1"
                      max="12"
                      value={tileCount}
                      onChange={(event) =>
                        resizeDescriptions(
                          Number(event.target.value),
                          setTileCount,
                          setTileDescriptions,
                        )
                      }
                    />
                  </label>
                  <DescriptionList
                    label="Tiles"
                    descriptions={tileDescriptions}
                    onChange={setTileDescriptions}
                    includeReference
                  />
                </>
              )}
            </>
          ) : null}

          {kind === "ui" ? (
            <>
              <div className="grid gap-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Layout components</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUiComponents((current) => [
                        ...current,
                        {
                          id: nextComponentId,
                          type: "Panel",
                          name: "",
                          description: "",
                        },
                      ]);
                      setNextComponentId((current) => current + 1);
                    }}
                  >
                    <Plus /> Add component
                  </Button>
                </div>
                {uiComponents.map((component, index) => (
                  <div key={component.id} className="grid gap-3 rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground">
                        Component {index + 1}
                      </p>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Move component up"
                          disabled={index === 0}
                          onClick={() => moveUiComponent(index, -1)}
                        >
                          <ArrowUp />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Move component down"
                          disabled={index === uiComponents.length - 1}
                          onClick={() => moveUiComponent(index, 1)}
                        >
                          <ArrowDown />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Remove component"
                          disabled={uiComponents.length === 1}
                          onClick={() =>
                            setUiComponents((current) =>
                              current.filter((item) => item.id !== component.id),
                            )
                          }
                        >
                          <X />
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-medium">
                        Component
                        <NativeSelect
                          className="w-full"
                          value={component.type}
                          onChange={(event) =>
                            updateUiComponent(component.id, {
                              type: event.target.value,
                            })
                          }
                        >
                          {UI_COMPONENT_TYPES.map((type) => (
                            <NativeSelectOption key={type} value={type}>
                              {type}
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                      </label>
                      <label className="grid gap-2 text-sm font-medium">
                        Name
                        <Input
                          required
                          value={component.name}
                          onChange={(event) =>
                            updateUiComponent(component.id, {
                              name: event.target.value,
                            })
                          }
                        />
                      </label>
                    </div>
                    {component.type === "Custom" ? (
                      <label className="grid gap-2 text-sm font-medium">
                        Description
                        <Textarea
                          required
                          placeholder="Describe this component's shape and purpose..."
                          value={component.description}
                          onChange={(event) =>
                            updateUiComponent(component.id, {
                              description: event.target.value,
                            })
                          }
                        />
                      </label>
                    ) : null}
                  </div>
                ))}
              </div>
              <label className="grid gap-2 text-sm font-medium">
                Style
                <Textarea
                  required
                  className="min-h-20 resize-y"
                  placeholder="Describe the overall UI style..."
                  value={uiStyle}
                  onChange={(event) => setUiStyle(event.target.value)}
                />
              </label>
              <ImageReferenceField id="ui-reference" label="Reference" />
            </>
          ) : null}

          {kind === "audio" ? (
            <>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox checked={instrumental} onCheckedChange={setInstrumental} />
                Instrumental
              </label>

              {instrumental ? (
                <label className="grid gap-2 text-sm font-medium">
                  Style
                  <Textarea
                    required
                    className="min-h-24 resize-y"
                    placeholder="Describe the musical style, mood, instruments, rhythm, and intended use..."
                    value={customStyle}
                    onChange={(event) => setCustomStyle(event.target.value)}
                  />
                </label>
              ) : (
                <div className="grid gap-2 text-sm font-medium">
                  <label htmlFor="audio-style">Style</label>
                  <NativeSelect
                    id="audio-style"
                    className="w-full"
                    required
                    value={audioStyle}
                    onChange={(event) => setAudioStyle(event.target.value)}
                  >
                    {AUDIO_STYLES.map((style) => (
                      <NativeSelectOption key={style} value={style}>
                        {style}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </div>
              )}

              {!instrumental && audioStyle === "Custom" ? (
                <label className="grid gap-2 text-sm font-medium">
                  Custom style
                  <Input
                    required
                    placeholder="e.g. Dreamy synthwave with a slow, nostalgic pulse"
                    value={customStyle}
                    onChange={(event) => setCustomStyle(event.target.value)}
                  />
                </label>
              ) : null}

              <div className="grid gap-2">
                <div className="grid gap-2 text-sm font-medium">
                  <label htmlFor="audio-duration">Length</label>
                  <NativeSelect
                    id="audio-duration"
                    className="w-full"
                    required
                    value={duration}
                    onChange={(event) => setDuration(event.target.value)}
                  >
                    {AUDIO_DURATIONS.map((seconds) => (
                      <NativeSelectOption key={seconds} value={seconds}>
                        {seconds} seconds
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </div>
              </div>

              {!instrumental ? (
                <div className="grid gap-5 rounded-lg border bg-muted/20 p-4">
                  <label className="grid gap-2 text-sm font-medium">
                    Lyrics
                    <Textarea
                      className="min-h-24 resize-y"
                      placeholder="Enter lyrics, or leave blank to generate them..."
                      value={lyrics}
                      onChange={(event) => setLyrics(event.target.value)}
                    />
                  </label>
                  <div className="grid gap-2 text-sm font-medium">
                    <label htmlFor="audio-voice">Voice</label>
                    <NativeSelect
                      id="audio-voice"
                      className="w-full"
                      required
                      value={voice}
                      onChange={(event) => setVoice(event.target.value)}
                    >
                      <NativeSelectOption value="Male">Male voice</NativeSelectOption>
                      <NativeSelectOption value="Female">Female voice</NativeSelectOption>
                      <NativeSelectOption value="Child">Child voice</NativeSelectOption>
                      <NativeSelectOption value="Reference">
                        Upload voice reference
                      </NativeSelectOption>
                    </NativeSelect>
                  </div>
                  {voice === "Reference" ? (
                    <AudioUploadField
                      id="voice-reference"
                      label="Voice reference"
                      description="MP3, WAV, or M4A · one voice sample"
                      file={voiceReferenceFile}
                      error={voiceReferenceError}
                      inputRef={voiceReferenceInputRef}
                      required
                      onChange={(event) =>
                        handleAudioFileChange(event, setVoiceReferenceFile, setVoiceReferenceError)
                      }
                      onRemove={() => {
                        setVoiceReferenceFile(null);
                        setVoiceReferenceError("");
                        if (voiceReferenceInputRef.current)
                          voiceReferenceInputRef.current.value = "";
                      }}
                    />
                  ) : null}
                </div>
              ) : null}

              <AudioUploadField
                id="audio-reference"
                label="Reference"
                description="MP3, WAV, or M4A · one audio reference"
                file={audioReferenceFile}
                error={audioReferenceError}
                inputRef={audioReferenceInputRef}
                onChange={(event) =>
                  handleAudioFileChange(event, setAudioReferenceFile, setAudioReferenceError)
                }
                onRemove={() => {
                  setAudioReferenceFile(null);
                  setAudioReferenceError("");
                  if (audioReferenceInputRef.current) audioReferenceInputRef.current.value = "";
                }}
              />
            </>
          ) : null}

          {kind !== "audio" ? (
            <>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox checked={useProjectContext} onCheckedChange={setUseProjectContext} />
                Use {project.name} project context
              </label>

              <div
                className="rounded-lg border bg-muted/40 p-3 transition-opacity data-[disabled=true]:opacity-50"
                data-disabled={!useProjectContext}
                aria-disabled={!useProjectContext}
              >
                <p className="text-xs font-medium text-muted-foreground">Generation context</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[project.gameType, project.visualStyle, project.platform]
                    .filter(Boolean)
                    .map((item) => (
                      <Badge key={item} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                </div>
                {project.description ? (
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {project.description}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <Button type="submit">Create {labels[kind]}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AudioUploadField({
  id,
  label,
  description,
  file,
  error,
  inputRef,
  required = false,
  onChange,
  onRemove,
}: {
  id: string;
  label: string;
  description: string;
  file: File | null;
  error: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  required?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid gap-2">
      <div className="text-sm font-medium">{label}</div>
      <input
        ref={inputRef}
        className="sr-only"
        id={id}
        type="file"
        accept="audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/x-m4a,.mp3,.wav,.m4a"
        required={required && !file}
        onChange={onChange}
      />
      {file ? (
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <FileAudio className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatFileSize(file.size)} · {label}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Remove ${label.toLowerCase()}`}
            onClick={onRemove}
          >
            <X />
          </Button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="flex min-h-16 cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-3 transition-colors hover:bg-muted/50 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50"
        >
          <FileAudio className="size-5 text-muted-foreground" aria-hidden="true" />
          <span>
            <span className="block text-sm font-medium">Choose an audio file</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
          </span>
        </label>
      )}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function DescriptionList({
  label,
  descriptions,
  onChange,
  includeReference = false,
}: {
  label: string;
  descriptions: string[];
  onChange: (descriptions: string[]) => void;
  includeReference?: boolean;
}) {
  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium">{label}</p>
      {descriptions.map((description, index) => (
        <div key={index} className="grid gap-2 rounded-lg border p-3">
          <label className="grid gap-2 text-sm font-medium">
            Description {index + 1}
            <Textarea
              required
              className="min-h-20 resize-y"
              placeholder={`Describe ${label.slice(0, -1).toLowerCase()} ${index + 1}...`}
              value={description}
              onChange={(event) =>
                onChange(
                  descriptions.map((item, itemIndex) =>
                    itemIndex === index ? event.target.value : item,
                  ),
                )
              }
            />
          </label>
          {includeReference ? (
            <ImageReferenceField id={`tile-${index}-reference`} label="Reference" compact />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ImageReferenceField({
  id,
  label,
  compact = false,
}: {
  id: string;
  label: string;
  compact?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <Input
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className={compact ? "h-8 text-xs" : "h-9 text-sm"}
      />
      {!compact ? (
        <span className="text-xs font-normal text-muted-foreground">PNG, JPG, or WebP</span>
      ) : null}
    </label>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
