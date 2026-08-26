import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/actions/signout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";


export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>You&apos;re logged in.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Signed in as{" "}
            <span className="font-medium text-foreground">
              {session.user.email}
            </span>
          </p>
          <Button asChild className="w-full">
            <Link href="/dashboard/upload">Upload a document</Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
             <Link href="/dashboard/documents">View my documents</Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/search">Search documents</Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
             <Link href="/dashboard/ask">Ask your documents</Link>
          </Button>
        </CardContent>

        <CardFooter>
          <form action={logout} className="w-full">
            <Button type="submit" variant="outline" className="w-full">
              Sign out
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}