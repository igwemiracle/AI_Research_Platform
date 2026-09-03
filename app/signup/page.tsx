import Link from "next/link";
import { SignupForm } from "@/components/signup-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-background overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-purple-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" />

      {/* Top Bar with Home Link & Theme Toggle */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md my-8">
        <SignupForm />
      </div>
    </div>
  );
}