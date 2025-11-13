import LoginButton from "@/components/auth/login-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Package } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Login() {

  const session = await auth.api.getSession({
    headers : await headers()
  })
  if(session) redirect("/")
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-teal-500">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto p-3 rounded-full bg-teal-500 w-fit">
            <Package className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-teal-600">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-500">
            Sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* main content */}
          <LoginButton />
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-teal-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
