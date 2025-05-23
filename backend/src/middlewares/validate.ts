import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validate = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    error: error.errors.map((err) => ({
                        path: err.path.join("."),
                        message: err.message,
                    })),
                });
                return;
            }
            res.status(500).json({ error: "Internal server error" });
            return;
        }
    };
}; 