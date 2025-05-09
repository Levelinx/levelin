import { supabase } from "../config";
import { Request, Response } from "express";

export const createDomain = async (req: Request, res: Response) => {
    const { domain } = req.body;
    const { data, error } = await supabase.from("domains").insert({ name: domain }).select();
    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(200).json({ data });
    }
}