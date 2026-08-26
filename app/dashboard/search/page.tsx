import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { searchChunks } from "@/lib/search";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Search, FileText } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query
    ? await searchChunks(query, session.user.id)
    : [];

  return (
    <div className="flex min-h-screen items-start justify-center p-4 pt-16">
      <div className="w-full max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Search your documents</CardTitle>
            <CardDescription>
              Find relevant passages across everything you&apos;ve uploaded.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form method="GET" className="flex gap-2">
              <Input
                type="text"
                name="q"
                placeholder="What are you looking for?"
                defaultValue={query}
                autoFocus
              />
              <Button type="submit">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {query && (
          <SearchResults query={query} results={results} />
        )}
      </div>
    </div>
  );
}

function SearchResults({
  query,
  results,
}: {
  query: string;
  results: Awaited<ReturnType<typeof searchChunks>>;
}) {
  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <Search className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No matches found for &quot;{query}&quot;.
          </p>
          <p className="text-xs text-muted-foreground">
            Try a different phrase, or check that your documents have
            finished processing.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {results.length} result{results.length !== 1 ? "s" : ""} for &quot;
        {query}&quot;
      </p>
      {results.map((result) => (
        <Card key={result.chunkId}>
          <CardContent className="space-y-2 pt-6">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-muted-foreground" />
              {result.fileName}
            </div>
            <p className="text-sm text-muted-foreground">
              {result.content}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}