"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Copy,
  Check,
  Sparkles,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface SearchResult {
  chunkId: string;
  documentId: string;
  fileName: string;
  content: string;
  distance: number;
}

export function SearchResultsView({
  query,
  results,
}: {
  query: string;
  results: SearchResult[];
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  function copyToClipboard(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  if (results.length === 0) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Search className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              No matching passages found
            </h3>
            <p className="text-xs text-muted-foreground max-w-md">
              We couldn&apos;t find semantic matches for &quot;{query}&quot;. Try broader terms or make sure your uploaded documents have finished vector processing.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          Found <span className="text-foreground font-semibold">{results.length}</span> semantic passages for &quot;{query}&quot;
        </p>
        <span className="text-[11px] text-muted-foreground">
          Ordered by cosine similarity
        </span>
      </div>

      <div className="space-y-3">
        {results.map((result, idx) => {
          // Approximate similarity % from cosine distance (distance <= 0 is identical, up to ~1)
          const similarityScore = Math.max(
            1,
            Math.min(99, Math.round((1 - result.distance) * 100))
          );
          const isCopied = copiedId === result.chunkId;
          const isExpanded = !!expandedIds[result.chunkId];
          const isLongText = result.content.length > 280;
          const displayText =
            isLongText && !isExpanded
              ? result.content.slice(0, 280) + "..."
              : result.content;

          return (
            <Card
              key={result.chunkId}
              className="border-border/60 shadow-sm transition-all hover:border-border hover:shadow"
            >
              <CardContent className="p-5 space-y-3">
                {/* Result Top Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-muted text-[11px] font-semibold text-muted-foreground">
                      {idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5 font-medium text-xs text-foreground">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      <span>{result.fileName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-medium ${
                        similarityScore >= 75
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : similarityScore >= 50
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {similarityScore}% Match
                    </Badge>
                  </div>
                </div>

                {/* Excerpt Body */}
                <div className="rounded-lg bg-muted/30 p-3.5 text-xs leading-relaxed text-foreground/90 font-mono">
                  {displayText}
                </div>

                {/* Card Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <div>
                    {isLongText && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(result.chunkId)}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        {isExpanded ? (
                          <>
                            <span>Show less</span>
                            <ChevronUp className="h-3 w-3" />
                          </>
                        ) : (
                          <>
                            <span>Read full chunk</span>
                            <ChevronDown className="h-3 w-3" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(result.chunkId, result.content)}
                      className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>

                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 text-xs"
                    >
                      <Link
                        href={`/dashboard/ask?q=${encodeURIComponent(
                          `Tell me more about: ${result.content.slice(0, 100)}`
                        )}`}
                      >
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span>Ask AI</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
