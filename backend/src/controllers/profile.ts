import { supabase } from "../config";
import { Request, Response } from "express";

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        res.status(500).json({ error: error.message });
    }
    if (!data) {
        res.status(404).json({ error: "Profile not found" });
    }
    res.status(200).json({ data });
}

export const getRandomProfiles = async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(5)
        .order("created_at", { ascending: false });

    if (error) {
        res.status(500).json({ error: error.message });
    }
    res.status(200).json({ data });
}

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user; // From auth middleware
    const { name, bio, avatar_url } = req.body;

    const { data, error } = await supabase
        .from("profiles")
        .update({ name, bio, avatar_url, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        res.status(500).json({ error: error.message });
    }
    res.status(200).json({ data });
}

export const getUploadUrl = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user; // From auth middleware
    const { fileType } = req.body;

    if (!fileType) {
        res.status(400).json({ error: "File type is required" });
    }

    const fileName = `${id}/${Date.now()}.${fileType.split("/")[1]}`;
    const { data, error } = await supabase.storage
        .from("objects")
        .createSignedUploadUrl(fileName);

    if (error) {
        res.status(500).json({ error: error.message });
    }

    res.status(200).json({ 
        uploadUrl: data?.signedUrl,
        path: fileName
    });
} 