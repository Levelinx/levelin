import { z } from "zod";

export const getProfileSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid profile ID")
    })
});

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required").max(100, "Name is too long"),
        bio: z.string().max(500, "Bio is too long").optional(),
        avatar_url: z.string().url("Invalid avatar URL").optional()
    })
});

export const getUploadUrlSchema = z.object({
    body: z.object({
        fileType: z.string().regex(/^image\/(jpeg|png|gif|webp)$/, "Invalid file type. Must be an image (jpeg, png, gif, webp)")
    })
});

export const searchProfilesSchema = z.object({
    query: z.object({
        search: z.string().min(1, "Search query is required"),
        cursor: z.string().optional(),
        limit: z.string().optional().transform(val => val ? parseInt(val) : 10)
    })
}); 