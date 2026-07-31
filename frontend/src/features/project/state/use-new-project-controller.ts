import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";

import { useCreateProjectMutation } from "@/model";

import { createNewProjectDraft, toProjectSummary } from "../types";

type NewProjectStart = "idea" | "blank" | "existing" | null;
type ExistingGameImportMode = "link" | "file";

export function useNewProjectController() {
  const navigate = useNavigate({ from: "/projects/new" });
  const { mutateAsync: createProject } = useCreateProjectMutation();
  const [selectedStart, setSelectedStart] = useState<NewProjectStart>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importMode, setImportMode] = useState<ExistingGameImportMode>("link");
  const [gameUrl, setGameUrl] = useState("");
  const [gameFile, setGameFile] = useState<File | null>(null);
  const form = useForm({
    defaultValues: createNewProjectDraft(),
    onSubmit: async ({ value }) => {
      const project = toProjectSummary({
        ...value,
        name: value.name.trim() || "Untitled game",
      });
      await createProject(project);
      await navigate({
        to: "/projects",
        search: { project: project.id, q: "" },
      });
    },
  });

  return {
    backToLibrary: () =>
      void navigate({
        to: "/projects",
        search: { project: undefined, q: "" },
      }),
    start: {
      selected: selectedStart,
      chooseIdea: () => setSelectedStart("idea"),
      chooseBlank: () => setSelectedStart("blank"),
      openExistingGameImport: () => setImportOpen(true),
    },
    form: {
      instance: form,
      selectedStart,
      goBack: () => setSelectedStart(null),
    },
    existingGameImport: {
      isOpen: importOpen,
      mode: importMode,
      gameUrl,
      gameFile,
      selectLink: () => setImportMode("link"),
      selectFile: () => setImportMode("file"),
      setGameUrl,
      setGameFile,
      dismiss: () => setImportOpen(false),
      continue: () => {
        setImportOpen(false);
        setSelectedStart("existing");
      },
    },
  };
}

export type NewProjectController = ReturnType<typeof useNewProjectController>;
