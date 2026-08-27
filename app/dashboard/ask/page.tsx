import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { generateAnswer } from "@/lib/rag";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Sparkles, FileText, Send } from "lucide-react";

export default async function AskPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { q } = await searchParams;
  const question = q?.trim() ?? "";
  const result = question
    ? await generateAnswer(question, session.user.id)
    : null;

  return (
    <div className="flex min-h-screen items-start justify-center p-4 pt-16">
      <div className="w-full max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Ask your documents</CardTitle>
            <CardDescription>
              Ask a question and get an answer grounded in what you&apos;ve
              uploaded.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form method="GET" className="flex gap-2">
              <Input
                type="text"
                name="q"
                placeholder="e.g. What's our refund policy?"
                defaultValue={question}
                autoFocus
              />
              <Button type="submit">
                <Send className="h-4 w-4" />
                Ask
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && <AnswerDisplay question={question} result={result} />}
      </div>
    </div>
  );
}

function AnswerDisplay({
  question,
  result,
}: {
  question: string;
  result: Awaited<ReturnType<typeof generateAnswer>>;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3 pt-6">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-sm leading-relaxed">{result.answer}</p>
          </div>
        </CardContent>
      </Card>

      {result.sources.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Sources
          </p>
          {result.sources.map((source, i) => (
            <Card key={i}>
              <CardContent className="space-y-1 pt-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs">
                    {i + 1}
                  </span>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {source.fileName}
                </div>
                <p className="pl-7 text-sm text-muted-foreground">
                  {source.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          No matching sources were found for this question.
        </p>
      )}
    </div>
  );
}