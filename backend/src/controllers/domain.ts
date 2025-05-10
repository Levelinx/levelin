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

export const getDomains = async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase
        .from("domains")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        res.status(500).json({ error: error.message });
    }
    res.status(200).json({ data });
}

export const getDomain = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from("domains")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        res.status(500).json({ error: error.message });
    }
    if (!data) {
        res.status(404).json({ error: "Domain not found" });
    }
    res.status(200).json({ data });
}