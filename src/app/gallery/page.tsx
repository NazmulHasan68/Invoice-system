'use server'

import { getPublicAsset } from "@/actions/Admin-actions";
import { getCategoriesAction } from "@/actions/dhaboard-actions";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface GallerPageProps {
    searchParams: {
        category?: string;
    };
}

export default async function GallerPage({ searchParams }: GallerPageProps) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (session?.user?.role === "admin") {
        redirect("/");
    }

    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-[65vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
            }
        >
            <GalleryContent searchParams={searchParams} />
        </Suspense>
    );
}

async function GalleryContent({ searchParams }: GallerPageProps) {
     const params = await searchParams;

    const categoryId = params?.category
        ? Number.parseInt(params.category)
        : undefined;

    const [categories, assets] = await Promise.all([
        getCategoriesAction(),
        getPublicAsset(categoryId),
    ]);

    return (
        <div className="min-h-screen container px-4 bg-white mt-10">
            {/* ---------------- Category Filter Section ---------------- */}
            <div className="sticky top-0 z-30 bg-white border-b py-3 px-4">
                <div className="container flex overflow-x-auto gap-2">
                    <Button
                        asChild
                        variant={!categoryId ? "default" : "outline"}
                        size="sm"
                    >
                        <Link href="/gallery">All</Link>
                    </Button>

                    {categories.map((c) => (
                        <Button
                            asChild
                            key={c.id}
                            variant={categoryId === c.id ? "default" : "outline"}
                            size="sm"
                        >
                            <Link href={`/gallery?category=${c.id}`}>
                                {c.name}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>

            {/* ---------------- Assets Grid ---------------- */}
            <div className="container py-10">
                {assets.length === 0 ? (
                    <p className="text-2xl font-bold text-center">
                        No assets uploaded! Please check back later.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {assets.map(
                            ({
                                assets,
                                categoryName,
                                userName,
                            }) => (
                                <Link
                                    href={`/gallery/${assets.id}`}
                                    key={assets.id}
                                    className="block"
                                >
                                    <div className="group relative overflow-hidden rounded-lg aspect-square">
                                        <Image
                                            src={assets.fileUrl}
                                            alt={assets.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <h3 className="text-white font-medium text-lg">
                                                    {assets.title}
                                                </h3>

                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-white/80 text-sm">
                                                        {userName}
                                                    </span>

                                                    {categoryName && (
                                                        <span className="bg-white/25 text-white text-xs px-2 py-1 rounded-full">
                                                            {categoryName}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
