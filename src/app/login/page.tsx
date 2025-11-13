import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import Link from "next/link";

export default function Login() {
    return (
        <div className=" flex min-h-screen items-center justify-center bg-slate-50">
            <Card className="w-full max-w-md shadow">
                <CardHeader className="text-center">
                    <div className="mx-auto p-2 rounded-full bg-teal-500 w-fit">
                        <Package className="w-5 h-5 text-white"/>
                    </div>
                    <CardTitle className=" text-2xl font-bold text-teal-600">
                        Welcome Back
                    </CardTitle>
                    <CardDescription>
                        Sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                        {/* main content */}
                </CardContent>
                <CardFooter className=" flex justify-center">
                    <Link href={'/'} className="text-sm text-slate-500 hover:text-slate-600">Back to home</Link>
                </CardFooter>
            </Card>
        </div>
    );
}