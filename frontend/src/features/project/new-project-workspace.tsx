import { useRef } from "react";
import {
  ArrowLeft,
  FilePlus2,
  Gamepad2,
  Lightbulb,
  Link2,
  Sparkles,
  Upload,
} from "lucide-react";

import { DropdownField } from "@/components/ui/custom/dropdown-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { NewProjectController } from "./state/use-new-project-controller";
import { projectContextOptions } from "./types";

export function NewProjectWorkspace({
  project,
}: {
  project: NewProjectController;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { backToLibrary, existingGameImport, form, start } = project;
  const { instance: newProjectForm, selectedStart } = form;

  return (
    <main className="new-project-page">
      <div className="new-project-header">
        <button type="button" className="back-link" onClick={backToLibrary}>
          <ArrowLeft size={16} /> Project library
        </button>
        <p className="eyebrow">New project</p>
        <h1>
          {selectedStart
            ? selectedStart === "blank"
              ? "Start with as little as you like"
              : "Tell us about your game"
            : "Where would you like to start?"}
        </h1>
        <p>
          {selectedStart
            ? selectedStart === "blank"
              ? "Add a name and any helpful context. You can also begin creating right away."
              : "Add the project basics and describe your idea. We will use them to guide your first asset generation."
            : "Pick the amount of structure you need. You can always add more project context later."}
        </p>
      </div>
      {!selectedStart ? (
        <div className="start-cards">
          <button
            type="button"
            className="start-card"
            onClick={start.openExistingGameImport}
          >
            <span className="start-card-icon">
              <Gamepad2 size={20} />
            </span>
            <h2>Existing game</h2>
            <p>
              Import a playable link or upload a local build so we can learn its
              direction.
            </p>
          </button>
          <button
            type="button"
            className="start-card"
            onClick={start.chooseIdea}
          >
            <span className="start-card-icon">
              <Lightbulb size={20} />
            </span>
            <h2>I have an idea</h2>
            <p>
              Describe the game, generate a visual direction, and refine it
              until it feels right.
            </p>
          </button>
          <button
            type="button"
            className="start-card"
            onClick={start.chooseBlank}
          >
            <span className="start-card-icon">
              <FilePlus2 size={20} />
            </span>
            <h2>Blank project</h2>
            <p>
              Open a flexible workspace. Add context if useful, or create an
              asset immediately.
            </p>
          </button>
        </div>
      ) : (
        <form
          className="project-form"
          onSubmit={(event) => {
            event.preventDefault();
            void newProjectForm.handleSubmit();
          }}
        >
          <div className="form-heading">
            <h2>Project context</h2>
            <p>These defaults appear in every generation request.</p>
          </div>
          <newProjectForm.Field name="name">
            {(field) => (
              <label>
                Project name
                <input
                  autoFocus
                  required={selectedStart !== "blank"}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="e.g. Moonlit Orchard"
                />
              </label>
            )}
          </newProjectForm.Field>
          <div className="form-grid">
            <newProjectForm.Field name="gameType">
              {(field) => (
                <DropdownField
                  label="Game type"
                  value={field.state.value}
                  options={projectContextOptions.gameTypes}
                  onChange={field.handleChange}
                />
              )}
            </newProjectForm.Field>
            <newProjectForm.Field name="platform">
              {(field) => (
                <DropdownField
                  label="Target platform"
                  value={field.state.value}
                  options={projectContextOptions.platforms}
                  onChange={field.handleChange}
                />
              )}
            </newProjectForm.Field>
          </div>
          <newProjectForm.Field name="visualStyle">
            {(field) => (
              <label>
                Visual style
                <input
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Pixel art, hand-painted, cartoon..."
                />
              </label>
            )}
          </newProjectForm.Field>
          <newProjectForm.Field name="description">
            {(field) => (
              <label>
                Game description
                <textarea
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="What is the player doing? What should the world feel like?"
                />
              </label>
            )}
          </newProjectForm.Field>
          <div className="form-actions">
            <button
              type="button"
              className="button button--quiet"
              onClick={form.goBack}
            >
              Back
            </button>
            <button className="button button--primary" type="submit">
              Create project <Sparkles size={16} />
            </button>
          </div>
        </form>
      )}
      <Dialog
        open={existingGameImport.isOpen}
        onOpenChange={(open) => !open && existingGameImport.dismiss()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import an existing game</DialogTitle>
            <DialogDescription>
              Share a playable link or upload a local game build to begin its
              project setup.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
            <Button
              variant={existingGameImport.mode === "link" ? "default" : "ghost"}
              onClick={existingGameImport.selectLink}
            >
              <Link2 /> Game link
            </Button>
            <Button
              variant={existingGameImport.mode === "file" ? "default" : "ghost"}
              onClick={existingGameImport.selectFile}
            >
              <Upload /> Local files
            </Button>
          </div>
          {existingGameImport.mode === "link" ? (
            <label className="grid gap-2 text-sm font-medium">
              Playable URL
              <Input
                type="url"
                placeholder="https://your-game.example"
                value={existingGameImport.gameUrl}
                onChange={(event) =>
                  existingGameImport.setGameUrl(event.target.value)
                }
              />
            </label>
          ) : (
            <>
              <input
                ref={fileInputRef}
                className="sr-only"
                type="file"
                accept=".zip,.html,.exe,.dmg,.apk"
                onChange={(event) =>
                  existingGameImport.setGameFile(
                    event.target.files?.[0] ?? null,
                  )
                }
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="grid min-h-32 place-items-center rounded-xl border border-dashed p-5 text-center text-sm hover:bg-muted/50"
              >
                <span>
                  <Upload className="mx-auto mb-2 size-5 text-muted-foreground" />
                  {existingGameImport.gameFile?.name ?? "Choose a game build"}
                </span>
              </button>
            </>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={existingGameImport.dismiss}>
              Cancel
            </Button>
            <Button
              disabled={
                existingGameImport.mode === "link"
                  ? !existingGameImport.gameUrl.trim()
                  : !existingGameImport.gameFile
              }
              onClick={existingGameImport.continue}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
