import { AppHeader } from "@/components/layouts/app-header";
import { ProjectChrome } from "@/components/layouts/project-chrome";
import { AssetLibrary } from "@/features/assets";

import { ProjectSidebar } from "./project-sidebar";
import { useProjectLibrary } from "./state/use-project-library";

export function ProjectLibrary() {
  const library = useProjectLibrary();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <ProjectChrome
        sidebar={
          <ProjectSidebar
            isProjectRoute
            projects={library.project.items}
            selectedProjectId={library.project.selectedId}
            onCreateProject={() => void library.project.create()}
            onDeleteProject={(projectId) =>
              void library.project.remove(projectId)
            }
            onSelectProject={library.project.select}
            onUpdateProject={library.project.update}
          />
        }
      >
        <AssetLibrary
          project={library.project.current}
          onOpenAsset={library.openAsset}
        />
      </ProjectChrome>
    </div>
  );
}
