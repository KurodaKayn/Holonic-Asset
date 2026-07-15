"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";

import { cn } from "@/lib/utils";

import type { ProjectSummary } from "../_data/project-demo-data";
import { ProjectSidebar } from "./project-sidebar";

export function ProjectChrome({
  children,
  projects,
}: {
  children: React.ReactNode;
  projects: ProjectSummary[];
}) {
  const pathname = usePathname();
  const isEditorRoute = pathname.startsWith("/project/assets/");

  return (
    <main
      className={cn(
        "flex min-h-0 flex-1 overflow-hidden bg-muted/30",
        isEditorRoute ? "h-screen" : "h-[calc(100vh-3.5rem)]",
      )}
    >
      {!isEditorRoute ? (
        <Suspense fallback={<div className="w-16 shrink-0 border-r bg-sidebar md:w-80" />}>
          <ProjectSidebar projects={projects} />
        </Suspense>
      ) : null}
      <section className="min-w-0 flex-1 overflow-hidden">{children}</section>
    </main>
  );
}
