import { z } from "zod";

export const ProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    bio: z.string().min(1, "Bio is required"),
    avatar_url: z.string().url("Invalid avatar URL"),
    date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});

export type ProfileInput = z.infer<typeof ProfileSchema>; 