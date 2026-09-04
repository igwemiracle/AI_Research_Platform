"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UploadCloud, Sparkles, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const pathMap: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Overview",
    subtitle: "Document intelligence metrics & activity",
  },
  "/dashboard/documents": {
    title: "Document Library",
    subtitle: "Manage, process and index uploaded files",
  },
  "/dashboard/upload": {
    title: "Upload Document",
    subtitle: "Import PDF documents for semantic processing",
  },
  "/dashboard/search": {
    title: "Semantic Vector Search",
    subtitle: "Natural language query across all vectorized chunks",
  },
  "/dashboard/ask": {
    title: "AI Document Assistant",
    subtitle: "Grounded Q&A with direct inline source citations",
  },
};

export function DashboardHeader({ userEmail }: { userEmail?: string | null }) {
  const pathname = usePathname();
  const current = pathMap[pathname] || {
    title: "Dashboard",
    subtitle: "AI Document Intelligence Platform",
  };

  return (
    <header className="sticky top-0 z-30 hidden h-16 w-full items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-md md:flex">
      {/* Breadcrumb / Page Title */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Platform</span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
        <div>
          <h1 className="text-sm font-semibold text-foreground tracking-tight">
            {current.title}
          </h1>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {pathname !== "/dashboard/upload" && (
          <Button asChild size="sm" className="gap-1.5 shadow-sm">
            <Link href="/dashboard/upload">
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload PDF</span>
            </Link>
          </Button>
        )}

        {pathname !== "/dashboard/ask" && (
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <Link href="/dashboard/ask">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Ask AI</span>
            </Link>
          </Button>
        )}

        <div className="h-4 w-px bg-border/60" />

        <ThemeToggle />

        {userEmail && (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border border-border/80 text-xs font-semibold text-foreground"
            title={`Signed in as ${userEmail}`}
          >
            {userEmail.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}
