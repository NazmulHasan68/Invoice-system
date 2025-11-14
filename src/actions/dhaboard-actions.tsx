'use server'

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { assets, category } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z} from 'zod'

const AssetSchema = z.object({
    title : z.string(),
    description : z.string().optional(),
    categoryId : z.number().positive('Please select a category'),
    fileUrl : z.string().url('Invalid file url'),
    thumbnailUrl : z.string().url('Invalid file url').optional(),
})

export async function getCategoriesAction() {
    try {
        return db.select().from(category)
    } catch (error) {
        console.log(error);
        return []
    }
}


export async function uploadAssetAction(formData:FormData) {
    const session = await auth.api.getSession({
        headers : await headers()
    })

    if(!session?.user){
        throw new Error('You must be login to upload you asset!')
    }

    try {
        const validateFields = AssetSchema.parse({
            title : formData.get('title'),
            description : formData.get('description'),
            categoryId : Number(formData.get('categoryId')),
            fileUrl : formData.get('fileUrl'),
            thumbnailUrl : formData.get('thumbnailUrl') || formData.get('fileUrl')
        })

        await db.insert(assets).values({
            title : validateFields.title,
            description : validateFields.description,
            fileUrl : validateFields.fileUrl,
            thumbnailUrl : validateFields.thumbnailUrl,
            isApproved : 'pending',
            userId :session.user.id,
            categoryId : validateFields.categoryId
        })

        revalidatePath('/user-dashboard/assets')
        return {
            success : true,
        }
        
    } catch (error) {
        console.log(error);
         return {
            success : true,
            error : "Failed to upload assest"
        }
    }
}


export async function getUserAssetsAction(userId:string) {
    try {
        
        return await db.select().from(assets).where(eq(assets.userId, userId)).orderBy(assets.createdAt)
    } catch (error) {
        console.log(error);
    }
}