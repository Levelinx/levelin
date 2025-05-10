import { z } from "zod";

export const createDomainSchema = z.object({
    body: z.object({
        domain: z.string().min(1, "Domain name is required")
    })
});

export const getDomainSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid domain ID")
    })
}); 