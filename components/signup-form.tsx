"use client";

import { useActionState, startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { Eye, EyeOff, Mail, Lock, Sparkles, Loader2 } from "lucide-react";
import { signup } from "@/app/actions/signup";
import { signInWithGithub } from "@/app/actions/github-signin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const signupSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, undefined);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: z.infer<typeof signupSchema>) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <Card className="w-full max-w-md border-border/60 bg-card/80 shadow-xl backdrop-blur-md">
      <CardHeader className="space-y-2 text-center pb-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-indigo-500/25">
          <Sparkles className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight">
          Create your DocuIntel Account
        </CardTitle>
        <CardDescription className="text-xs">
          Start uploading documents and generating grounded AI insights in minutes.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {state?.error && (
              <Alert variant="destructive" className="text-xs">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-medium">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        autoComplete="email"
                        className="pl-9 text-xs"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-medium">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        className="pl-9 pr-9 text-xs"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button
              type="submit"
              className="w-full gap-2 font-medium shadow-sm"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="relative flex w-full items-center">
              <Separator className="flex-1" />
              <span className="px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Or continue with
              </span>
              <Separator className="flex-1" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 text-xs"
              onClick={() => signInWithGithub()}
            >
              <FaGithub className="h-4 w-4" />
              Continue with GitHub
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}