import { supabase } from "../config";
import { Request, Response } from "express";

export const createTarget = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user;
    const { 
        title, 
        description, 
        domain_id, 
        difficulty, 
        proof_requirements, 
        media_urls, 
        deadline,
        token_amount 
    } = req.body;

    const { data, error } = await supabase
        .from("targets")
        .insert({
            title,
            description,
            domain_id,
            difficulty,
            proof_requirements,
            media_urls,
            deadline,
            token_amount,
            creator_id: id,
            status: "open"
        })
        .select()
        .single();

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(201).json({ data });
}

export const getTargets = async (req: Request, res: Response) => {
    const { domain_id, status, difficulty } = req.query;
    
    let query = supabase
        .from("targets")
        .select(`
            *,
            creator:users!creator_id(*),
            domain:domains(*)
        `)
        .order("created_at", { ascending: false });

    if (domain_id) {
        query = query.eq("domain_id", domain_id);
    }
    if (status) {
        query = query.eq("status", status);
    }
    if (difficulty) {
        query = query.eq("difficulty", difficulty);
    }

    const { data, error } = await query;

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json({ data });
}

export const getTargetById = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const { data, error } = await supabase
        .from("targets")
        .select(`
            *,
            creator:users!creator_id(*),
            domain:domains(*),
            submissions:target_submissions(
                *,
                user:users!user_id(*),
                reviews:target_reviews(*)
            )
        `)
        .eq("id", id)
        .single();

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json({ data });
}

export const submitTarget = async (req: Request, res: Response) => {
    const { id } = req.user; // From auth middleware
    const { target_id } = req.params;
    const { description, proof_url, media_urls, notes } = req.body;

    // First check if target exists and is open
    const { data: target, error: targetError } = await supabase
        .from("targets")
        .select("*")
        .eq("id", target_id)
        .single();

    if (targetError || !target) {
        res.status(404).json({ error: "Target not found" });
        return;
    }

    if (target.status !== "open") {
        res.status(400).json({ error: "Target is not open for submissions" });
        return;
    }

    // Check if deadline has passed
    if (target.deadline && new Date(target.deadline) < new Date()) {
        res.status(400).json({ error: "Target deadline has passed" });
        return;
    }

    // Create submission
    const { data, error } = await supabase
        .from("target_submissions")
        .insert({
            target_id,
            user_id: id,
            description,
            proof_url,
            media_urls,
            notes,
            status: "pending"
        })
        .select()
        .single();

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(201).json({ data });
}

export const reviewSubmission = async (req: Request, res: Response) => {
    const { id } = req.user; // From auth middleware
    const { submission_id } = req.params;
    const { feedback, status } = req.body;

    // First check if submission exists
    const { data: submission, error: submissionError } = await supabase
        .from("target_submissions")
        .select("*, target:targets(*)")
        .eq("id", submission_id)
        .single();

    if (submissionError || !submission) {
        res.status(404).json({ error: "Submission not found" });
        return;
    }

    // Check if the reviewer is the target creator
    if (submission.target.creator_id !== id) {
        res.status(403).json({ error: "Only the target creator can review submissions" });
        return;
    }

    // Create review
    const { data, error } = await supabase
        .from("target_reviews")
        .insert({
            submission_id,
            reviewer_id: id,
            feedback,
            status
        })
        .select()
        .single();

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    // Update submission status
    await supabase
        .from("target_submissions")
        .update({ status })
        .eq("id", submission_id);

    // If approved, update target status to completed
    if (status === "approved") {
        await supabase
            .from("targets")
            .update({ status: "completed" })
            .eq("id", submission.target_id);
        
        // TODO: Trigger smart contract function to transfer tokens (1.5x) to the user
        // This would be handled separately in a blockchain integration module
    }

    res.status(201).json({ data });
}

export const getUserTargets = async (req: Request, res: Response) => {
    const { id } = req.user;
    
    const { data, error } = await supabase
        .from("targets")
        .select(`
            *,
            creator:users!creator_id(*),
            domain:domains(*)
        `)
        .eq("creator_id", id)
        .order("created_at", { ascending: false });

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json({ data });
}

export const getUserSubmissions = async (req: Request, res: Response) => {
    const { id } = req.user;
    
    const { data, error } = await supabase
        .from("target_submissions")
        .select(`
            *,
            target:targets(*),
            reviews:target_reviews(*)
        `)
        .eq("user_id", id)
        .order("created_at", { ascending: false });

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json({ data });
} 