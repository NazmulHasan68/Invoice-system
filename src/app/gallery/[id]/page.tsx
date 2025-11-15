import { getAssetByIdActions } from "@/actions/Admin-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { Download, Info, Loader2, ShoppingCart, Tag } from "lucide-react"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"
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

    const { assets, userName, categoryName, userImage, userId} = result;

    const isAuthor = session?.user?.id === userId;
    const initaials = userName ? userName.split(" ").map((n)=> n[0]).join("").toUpperCase() : "U"

    const hasPurchaseAssts = false;

    return (
        <div className="mt-10 min-h-screen px-4 container bg-white">
            <div className="grid gap-12 md:grid-cols-3 grid-cols-1">
                <div className=" md:col-span-2 space-y-8">
                    <div className=" rounded-lg overflow-hidden bg-gray-100 border">
                        <div className=" relative w-full">
                            <Image 
                                src={assets?.fileUrl}
                                alt={assets?.title}
                                width={1200}
                                height={800}
                                className="w-full items-center justify-between"
                            />
                        </div>
                    </div>
                    <div className=" flex items-center justify-between ">
                        <div>
                            <h1 className=" text-3xl font-bold">{ assets?.title}</h1>
                            {
                                categoryName && (
                                    <Badge
                                        className=" mt-2 bg-gray-200 text-gray-700 hover:bg-gray-400"
                                    >
                                        <Tag className=" mr-2 h-4 w-4 "/> {categoryName}
                                    </Badge>
                                )
                            }
                        </div>
                        <div>
                            <p className=" text-sm font-medium ">{userName}</p>
                            <p className=" text-xs text-gray-500">Creator</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className=" sticky top-24">
                        <Card className=" overflow-hidden border-0 shadow-lg rounded-xl p-0">
                            <div className=" bg-linear-to-r from-gray-900 to-gray-800 p-6 text-white">
                                <h3 className=" text-xl font-bold mb-2">Premium Asset</h3>
                                <div>
                                    <span className="text-3xl font-bold ">$5</span>
                                    <span className="ml-2 text-gray-300 ">One Time Purchase</span>
                                </div>
                            </div>
                            <CardContent className=" p-4">
                                <div className=" space-y-4">
                                    {
                                        session?.user ? 
                                            isAuthor ? 
                                        <div className=" bg-blue-50 text-blue-700 p-5 rounded-lg flex items-start gap-3">
                                            <Info className=" w-5 h-5 text-blue-500 mt-1 shrink-0 text-xs"/><p>This is your Own asset. you can not puraches you own Asset</p>
                                        </div> 
                                        : hasPurchaseAssts ? <Button asChild className=" w-full bg-green-600 hover:bg-green-500 cursor-pointer text-white h-12">
                                            <a download> 
                                                <Download className="w-6 h-6 mr-2"/>
                                                Download Asset
                                            </a>
                                        </Button> : <form>
                                            <Button type="submit" className=" w-full bg-black text-white h-12 ">
                                                <ShoppingCart className="w-6 h-6 mr-2"/> Purchase Now
                                            </Button>
                                        </form>
                                        : <>
                                            <Button asChild className=" w-full bg-black text-white h-12">
                                                <Link href={'/login'}>Sign In to Purchase</Link>
                                            </Button>
                                        </>
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
