import { getCategoriesAction } from "@/actions/dhaboard-actions";
import AssetGrid from "@/components/Dashboard/asset-grid";
import UploadAsset from "@/components/Dashboard/upload-asset";

export default async function Assets() {
    const [categories] = await Promise.all([getCategoriesAction()])

    return <div className="container py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold">My Assets</h1>
                <UploadAsset categories={categories || []} />
            </div>
            <AssetGrid/>
    </div>
}