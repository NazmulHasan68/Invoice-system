import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function GallerPage() {
    const session = await auth.api.getSession({
        headers : await headers()
    })

    if(session && session?.user?.role === 'admin') redirect('/');


    return (
        <div className="py-10 mt-10">Gallery Page</div>
    );
}