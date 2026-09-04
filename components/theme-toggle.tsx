"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({
  className,
  variant = "ghost",
  size = "icon",
}: {
  className?: string;
  variant?: "ghost" | "outline" | "default" | "secondary";
  size?: "icon" | "sm" | "default";
}) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  if (!mounted) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        aria-label="Toggle theme"
      >
        <span className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={className}
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-muted-foreground transition-transform hover:rotate-12" />
      ) : (
        <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
      )}
    </Button>
  );
}
