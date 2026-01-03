import { getAssetByIdActions } from "@/actions/Admin-actions";
import BuyAssets from "@/components/Dashboard/BuyAssets";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Info, Loader2, Tag } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface GalleryDetailsPageProps {
  params: { id: string };
}

export default async function GalleryDetailsPage({ params }: GalleryDetailsPageProps) {
  // If params is a promise, unwrap it:
  const unwrappedParams = await params; // <-- important fix
  const assetId = unwrappedParams.id;

  // Fetch user session
  const session = await auth.api.getSession({ headers: await headers() });

  // Fetch asset from DB
  const result = await getAssetByIdActions(assetId);
  if (!result) notFound();

  const { assets, userName, categoryName, userId } = result;
  const isAuthor = session?.user?.id === userId;

  return (
    <div className="mt-10 min-h-screen px-4 container bg-white">
      <div className="grid gap-12 md:grid-cols-3 grid-cols-1">
        {/* Left section */}
        <div className="md:col-span-2 space-y-8">
          <div className="rounded-lg overflow-hidden bg-gray-100 border">
            <Image
              src={assets.fileUrl}
              alt={assets.title}
              width={1200}
              height={800}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{assets.title}</h1>
              {categoryName && (
                <Badge className="mt-2 bg-gray-200 text-gray-700 hover:bg-gray-400">
                  <Tag className="mr-2 h-4 w-4" />
                  {categoryName}
                </Badge>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-gray-500">Creator  </p>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="space-y-6 sticky top-24">
          <Card className="overflow-hidden border-0 shadow-lg rounded-xl p-0">
            <div className="bg-linear-to-r from-gray-900 to-gray-800 p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Premium Asset</h3>
              <div>
                <span className="text-3xl font-bold">$53</span>
                <span className="ml-2 text-gray-300">One Time Purchase </span>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-4">
                {session?.user ? (
                  isAuthor ? (
                    <div className="bg-blue-50 text-blue-700 p-5 rounded-lg flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-500 mt-1 shrink-0 text-xs" />
                      <p>This is your own asset.  You cannot purchase your own. lkj</p>
                    </div>
                  ) : (
                    <BuyAssets assetId={assets.id} />
                  )
                ) : (
                  <Link href="/login">
                    <Card className="w-full bg-black text-white h-12 flex items-center justify-center">
                      Sign klj 
                    </Card>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
