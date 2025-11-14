"use client";

import Image from "next/image";
import { Badge } from "../ui/badge";
import { formatDistanceToNow} from 'date-fns'

type Asset = {
    id: string;
    title: string;
    description: string | null;
    fileUrl: string;
    thumbnailUrl: string | null;   // FIXED
    isApproved: string;
    categoryId: number | null;     // FIXED
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};


interface AssetsProp {
    assets: Asset[];
}

export default function AssetGrid({ assets }: AssetsProp) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assets?.map((item) => (
                <div
                    key={item.id}
                    className="border rounded-lg p-1 shadow bg-white cursor-pointer relative hover:scale-105 transition-all hover:shadow-2xl"
                >
                    <div className="relative w-full h-40">
                        <Image
                            src={item.thumbnailUrl || item.fileUrl}
                            alt={item.title}
                            fill
                            className="object-cover rounded"
                        />
                    </div>

                    <h2 className="text-md font-bold mt-1 p-2">{item.title}</h2>

                    <div className=" absolute top-2 right-2">
                        <Badge className={
                            item.isApproved === 'approved' ? 'bg-teal-500' : 
                            item.isApproved === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                        } variant={'default'}>
                            {item.isApproved === 'approved' ? 'Approved' : item.isApproved === 'rejected' ? "Rejected":"Pending"}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <span className="px-2 text-sm text-slate-600">
                            {
                                formatDistanceToNow(new Date(item.createdAt),{
                                    addSuffix : true
                                })
                            }
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
