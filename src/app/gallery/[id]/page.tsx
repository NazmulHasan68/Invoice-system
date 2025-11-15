import { getAssetByIdActions } from "@/actions/Admin-actions"
import { auth } from "@/lib/auth"
import { Loader2 } from "lucide-react"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"

interface galleryDetaillsPageProps{
    params : {
        id : string
    }
}

export default function GalleryDetailsPage({ params }: galleryDetaillsPageProps) {
    return (
        <Suspense
            fallback={
                <div className="flex items-center mt-10 justify-center min-h-[65vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
            }
        >
            <GalleryContentPage params={params} />
        </Suspense>
    );
}



async function GalleryContentPage(props: galleryDetaillsPageProps) {
    const params = await props.params; // correct way

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (session && session?.user?.role === "admin") {
        redirect("/");
    }

    const result = await getAssetByIdActions(params.id);

    if (!result) notFound();

    console.log(result);
    

    return (
        <div className="mt-10">
            {/* Your details UI here */} adfsdf asdf sdfas
        </div>
    );
}
