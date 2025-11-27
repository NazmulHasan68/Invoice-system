import { getAllCategoryActions, getTotalAssetsAction, getTotalUsersCountAction } from "@/actions/Admin-actions";
import CategoryManager from "@/components/admin/category-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Folder } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Settings() {
  const [categories, userCount, assetsCount] = await Promise.all([
    getAllCategoryActions(),
    getTotalUsersCountAction(),
    getTotalAssetsAction()
  ]);


  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-5">Admin Setting s</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-7">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Users className="mr-2 h-5 w-5 text-teal-500" />
              Total Users
            </CardTitle>
            <CardDescription>All registered  users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-teal-500">
              {userCount?.totalUsers ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Folder className="mr-2 h-5 w-5 text-teal-500" />
              Total Assets
            </CardTitle>
            <CardDescription>Uploaded files & media </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-teal-500">{assetsCount?.totalAsset ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryManager categories={Array.isArray(categories) ? categories : []} />
        </CardContent>
      </Card>
    </div>
  );
}
