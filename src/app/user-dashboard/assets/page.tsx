import { getCategoriesAction, getUserAssetsAction } from "@/actions/dhaboard-actions";
import AssetGrid from "@/components/Dashboard/asset-grid";
import UploadAsset from "@/components/Dashboard/upload-asset";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Assets() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) return null;

    const [categories, assets] = await Promise.all([
        getCategoriesAction(),
        getUserAssetsAction(session.user.id)
    ]);



    return (
        <div className="container py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold">My Assets</h1>
                <UploadAsset categories={categories || []} />
            </div>

            {/* FIXED */}
            <AssetGrid assets={assets ?? []} />
        </div>
    );
}
