import { z } from "zod";

export const createChallengeSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required").max(200, "Title is too long"),
        description: z.string().min(1, "Description is required").max(2000, "Description is too long"),
        domain_id: z.string().uuid("Invalid domain ID"),
        difficulty: z.enum(["beginner", "intermediate", "advanced"], {
            errorMap: () => ({ message: "Difficulty must be beginner, intermediate, or advanced" })
        }),
        requirements: z.array(z.string()).min(1, "At least one requirement is needed")
    })
});

export const getChallengesSchema = z.object({
    query: z.object({
        domain_id: z.string().uuid("Invalid domain ID").optional(),
        status: z.enum(["open", "closed", "in_review"], {
            errorMap: () => ({ message: "Status must be open, closed, or in_review" })
        }).optional(),
        difficulty: z.enum(["beginner", "intermediate", "advanced"], {
            errorMap: () => ({ message: "Difficulty must be beginner, intermediate, or advanced" })
        }).optional()
    })
});

export const submitChallengeSchema = z.object({
    params: z.object({
        challenge_id: z.string().uuid("Invalid challenge ID")
    }),
    body: z.object({
        submission_url: z.string().url("Invalid submission URL"),
        notes: z.string().max(1000, "Notes are too long").optional()
    })
});

export const reviewChallengeSchema = z.object({
    params: z.object({
        submission_id: z.string().uuid("Invalid submission ID")
    }),
    body: z.object({
        rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
        feedback: z.string().min(1, "Feedback is required").max(1000, "Feedback is too long"),
        status: z.enum(["approved", "rejected"], {
            errorMap: () => ({ message: "Status must be approved or rejected" })
        })
    })
}); 