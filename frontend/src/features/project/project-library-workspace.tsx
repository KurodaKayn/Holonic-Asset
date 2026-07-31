import { AppHeader } from "@/components/layouts/app-header";
import { ProjectChrome } from "@/components/layouts/project-chrome";
import { AssetLibrary } from "@/features/assets";

import { ProjectSidebar } from "./project-sidebar";
import type { ProjectLibraryController } from "./state/use-project-library";

export function ProjectLibraryWorkspace({
  library,
}: {
  library: ProjectLibraryController;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <ProjectChrome sidebar={<ProjectSidebar library={library.project} />}>
        <AssetLibrary
          project={library.project.current}
          onOpenAsset={library.openAsset}
        />
      </ProjectChrome>
    </div>
  );
}
