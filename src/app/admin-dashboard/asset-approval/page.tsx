
import { approvedAssetAction, getPendingAssetsAction, rejectAssetAction } from "@/actions/Admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";
import Image from "next/image";

export default async function AssetApproval() {

    const pendingAssets = await getPendingAssetsAction();


    if (!pendingAssets || !Array.isArray(pendingAssets) || pendingAssets.length === 0) {
    return (
        <Card className="bg-white mt-10">
        <CardContent className="py-16 flex flex-col items-center justify-center">
            <p className="text-center text-slate-600 text-xl">
                All assets have been reviewed
            </p>
        </CardContent>
        </Card>
    );
    }

    // যদি pendingAssets সত্যিই array হয়
    return (
        <div className="grid grid-cols-1 mt-10 md:grid-cols-3 gap-4">
            {pendingAssets?.map(({assets, userName}) => (
                <div
                    key={assets.id}
                    className="border rounded-lg p-1 shadow bg-white cursor-pointer relative hover:scale-105 transition-all hover:shadow-2xl"
                >
                    <div className="relative w-full h-40">
                        <Image
                            src={assets.thumbnailUrl || assets.fileUrl}
                            alt={assets.title}
                            fill
                            className="object-cover rounded"
                        />
                    </div>

                    <h2 className="text-md font-bold mt-1 p-2">{assets.title}</h2>

                    <div className="flex justify-between items-center mt-1">
                        <span className="px-2 text-sm text-slate-600">
                            {
                                formatDistanceToNow(new Date(assets.createdAt),{
                                    addSuffix : true
                                })
                            }
                        </span>
                        <div className=" flex px-2 py-2 items-center text-sm text-slate-400">
                            <User className="mr-2 h-5 w-5"/> {userName}
                        </div>
                    </div>

                    <div className=" p-2 flex justify-between items-center">
                        <form action={async()=>{
                            'use server' 
                            await approvedAssetAction(assets.id)
                        }}>
                            <Button className=" bg-teal-500 hover:bg-teal-600 cursor-pointer">Approve</Button>
                        </form>
                        <form action={async()=>{
                            'use server' 
                            await rejectAssetAction(assets.id)
                        }}>
                            <Button className=" bg-red-500 hover:bg-red-600 cursor-pointer">Rejected</Button>
                        </form>
                    </div>
                </div>
            ))}
        </div>
    );
}