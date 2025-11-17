'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { assets, category, user } from '@/lib/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import {  z } from 'zod'


/* ------------------------------------------
   ✅ Category Schema (Validation)
--------------------------------------------- */
const CategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must be max 50 characters'),
})

export type CategoryFormValues = z.infer<typeof CategorySchema>

/* ------------------------------------------
   ✅ Add New Category
--------------------------------------------- */
export async function addNewCategoryAction(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user || session.user.role !== 'admin') {
      throw new Error('You must be an admin to add categories')
    }

    const name = formData.get('name') as string
    const validatedFields = CategorySchema.parse({ name })

    const existingCategory = await db
      .select()
      .from(category)
      .where(eq(category.name, validatedFields.name))
      .limit(1)

    if (existingCategory.length > 0) {
      return {
        success: false,
        message: 'Category already exists! Please try with a different name.',
      }
    }

    await db.insert(category).values({
      name: validatedFields.name,
    })

    revalidatePath('/admin-dashboard/settings')

    return {
      success: true,
      message: 'New category added successfully!',
    }
  } catch (error) {
    console.error('addNewCategoryAction Error:', error)

    return {
      success: false,
      message: 'Failed to add category.',
    }
  }
}

/* ------------------------------------------
   ✅ Get All Categories
--------------------------------------------- */
export async function getAllCategoryActions() {
  try {
    const result = await db.select().from(category).orderBy(category.name)
    return result
  } catch (error) {
    console.error('getAllCategoryActions Error:', error)
    return {
      success: false,
      message: 'Failed to fetch categories.',
    }
  }
}

/* ------------------------------------------
   ✅ Get Total Users Count (Admin only)
--------------------------------------------- */
export async function getTotalUsersCountAction() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });


    if (!session?.user || session.user.role !== 'admin') {
      throw new Error('You must be an admin to access this data')
    }

    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(user)

    const totalUsers = result[0]?.count ?? 0;

    return { success: true, totalUsers };
    
  } catch (error) {
    console.error('getTotalUsersCount Error:', error)
    return {
      success: false,
      message: 'Failed to fetch user count.',
    }
  }
}



export async function deleteCategoryActions(categoryId:number) {
     const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user || session.user.role !== 'admin') {
      throw new Error('You must be an admin to delete categories')
    }

    try {
        await db.delete(category).where(eq(category.id, categoryId))
        revalidatePath('/admin-dashboard/settings')
        return {
        success: true,
        message: ' delete category',
        } 
    } catch (error) {
       console.error('delete category Error:', error)
    return {
      success: false,
      message: 'Failed to delete category',
    } 
    }
}


/* ------------------------------------------
   ✅ Get All Assets
--------------------------------------------- */
export async function getTotalAssetsAction() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });


    if (!session?.user || session.user.role !== 'admin') {
      throw new Error('You must be an admin to access this data')
    }

    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(assets)

    const totalAsset = result[0]?.count ?? 0;
    return { success: true, totalAsset };

    
  } catch (error) {
    console.error('getTotalUsersCount Error:', error)
    return {
      success: false,
      message: 'Failed to fetch user count.',
    }
  }
}


export async function approvedAssetAction(assetId: string) {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user || session.user.role !== 'admin') {
      throw new Error('You must be an admin to Approved this Data')
    }

    try {
      await db.update(assets).set({isApproved : 'approved' , updatedAt : new Date()}).where(eq(assets.id , assetId))
      revalidatePath('/admin-dashboard/asset-approval')
      return{
        success : true
      }
    } catch (error) {
      console.log(error);
      
      return {
        success : false
      }
    }
}


export async function rejectAssetAction(assetId: string) {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user || session.user.role !== 'admin') {
      throw new Error('You must be an admin to Reject this data')
    }

    try {
      await db.update(assets).set({isApproved : 'rejected' , updatedAt : new Date()}).where(eq(assets.id , assetId))
      revalidatePath('/admin-dashboard/asset-approval')
       return{
        success : true
      }
    } catch (error) {
      console.log(error);
      
      return {
        success : false
      }
    }
}



export async function getPendingAssetsAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('You must be an admin to review assets');
  }

  try {
    const pendingAssets = await db.select({
        assets :assets,
        userName: user.name,
      })
      .from(assets)
      .leftJoin(user, eq(assets.userId, user.id))
      .where(eq(assets.isApproved, 'pending'));

    return pendingAssets; // সবসময় array
  } catch (error) {
    console.error('getPendingAssetsAction Error:', error);
    return []; // catch-এও empty array return
  }
}



export async function getPublicAsset(categoryId?: number) {
  try {
    const conditions = [
      eq(assets.isApproved, "approved")
    ];

    if (categoryId) {
      conditions.push(eq(assets.categoryId, categoryId));
    }

    const query = await db
      .select({
        assets: assets,
        categoryName: category.name,
        userName: user.name,
      })
      .from(assets)
      .leftJoin(category, eq(assets.categoryId, category.id))
      .leftJoin(user, eq(assets.userId, user.id))
      .where(and(...conditions)); // 👈 this is allowed

    return query;
  } catch (error) {
    console.log(error);
    return [];
  }
}



export async function getAssetByIdActions(assetId:string) {
  try {
    const [result] = await db.select({
      assets : assets,
      categoryName :category.name,
      userName : user.name,
      userImage : user.image,
      userId : user.id
    }).from(assets)
       .leftJoin(category, eq(assets.categoryId, category.id))
        .leftJoin(user, eq(assets.userId, user.id))
         .where(eq(assets.id, assetId))
    
    return result
  } catch (error) {
    console.log(error);
    
    return null
  }
}