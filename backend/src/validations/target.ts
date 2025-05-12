import { z } from "zod";

export const createTargetSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required").max(200, "Title is too long"),
        description: z.string().min(1, "Description is required").max(2000, "Description is too long"),
        domain_id: z.string().uuid("Invalid domain ID"),
        difficulty: z.enum(["beginner", "intermediate", "advanced"], {
            errorMap: () => ({ message: "Difficulty must be beginner, intermediate, or advanced" })
        }),
        proof_requirements: z.string().min(1, "Proof requirements are required"),
        media_urls: z.array(z.string().url("Invalid URL")).optional(),
        deadline: z.string().datetime("Invalid date format").optional(),
        token_amount: z.number().min(0, "Token amount must be positive")
    })
});

export const getTargetsSchema = z.object({
    query: z.object({
        domain_id: z.string().uuid("Invalid domain ID").optional(),
        status: z.enum(["open", "closed", "completed"], {
            errorMap: () => ({ message: "Status must be open, closed, or completed" })
        }).optional(),
        difficulty: z.enum(["beginner", "intermediate", "advanced"], {
            errorMap: () => ({ message: "Difficulty must be beginner, intermediate, or advanced" })
        }).optional()
    })
});

export const submitTargetSchema = z.object({
    params: z.object({
        target_id: z.string().uuid("Invalid target ID")
    }),
    body: z.object({
        description: z.string().min(1, "Description is required"),
        proof_url: z.string().url("Invalid proof URL"),
        media_urls: z.array(z.string().url("Invalid URL")).optional(),
        notes: z.string().max(1000, "Notes are too long").optional()
    })
});

export const reviewSubmissionSchema = z.object({
    params: z.object({
        submission_id: z.string().uuid("Invalid submission ID")
    }),
    body: z.object({
        feedback: z.string().min(1, "Feedback is required").max(1000, "Feedback is too long"),
        status: z.enum(["approved", "rejected"], {
            errorMap: () => ({ message: "Status must be approved or rejected" })
        })
    })
}); 