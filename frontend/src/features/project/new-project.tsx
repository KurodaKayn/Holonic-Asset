import { NewProjectWorkspace } from "./new-project-workspace";
import { useNewProjectController } from "./state/use-new-project-controller";

export function NewProject() {
  const project = useNewProjectController();

  return <NewProjectWorkspace project={project} />;
}
