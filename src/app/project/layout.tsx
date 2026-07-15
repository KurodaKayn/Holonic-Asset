import { ProjectChrome } from "./_components/project-chrome";
import { projectSummaries } from "./_data/project-demo-data";

export default function ProjectLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ProjectChrome projects={projectSummaries}>{children}</ProjectChrome>;
}
