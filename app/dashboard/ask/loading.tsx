import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";

export default function AskLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Heading */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">AI Document Assistant</h2>
        <p className="text-xs text-muted-foreground">
          Querying vector embeddings and synthesizing answers...
        </p>
      </div>

      {/* Input Skeleton */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6">
          <Skeleton className="h-11 w-full rounded-lg" />
          <div className="flex gap-2 pt-3">
            <Skeleton className="h-6 w-28 rounded-md" />
            <Skeleton className="h-6 w-36 rounded-md" />
            <Skeleton className="h-6 w-32 rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* AI Generating Indicator */}
      <Card className="relative overflow-hidden border-border/60 bg-card/60 shadow-md">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />

        <CardHeader className="flex flex-row items-center justify-between pb-3 pt-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm animate-pulse">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  Retrieving passages & synthesizing answer...
                </span>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Running 768-dim vector cosine similarity and grounding response
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[85%]" />
          <Skeleton className="h-4 w-[60%]" />
        </CardContent>
      </Card>

      {/* Sources Skeleton */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i} className="border-border/60">
              <CardContent className="p-4 space-y-2.5">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-16 w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}