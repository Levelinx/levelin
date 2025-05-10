import { supabase } from "../config";
import { Request, Response } from "express";

export const createChallenge = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user;
    const { title, description, domain_id, difficulty, requirements } = req.body;

    const { data, error } = await supabase
        .from("challenges")
        .insert({
            title,
            description,
            domain_id,
            difficulty,
            requirements,
            creator_id: id,
            status: "open"
        })
        .select()
        .single();

    if (error) {
        res.status(500).json({ error: error.message });
    }
    res.status(201).json({ data });
}

export const getChallenges = async (req: Request, res: Response) => {
    const { domain_id, status, difficulty } = req.query;
    
    let query = supabase
        .from("challenges")
        .select(`
            *,
            creator:profiles!creator_id(*),
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
    }
    res.status(200).json({ data });
}

export const submitChallenge = async (req: Request, res: Response) => {
    const { id } = req.user; // From auth middleware
    const { challenge_id } = req.params;
    const { submission_url, notes } = req.body;

    // First check if challenge exists and is open
    const { data: challenge, error: challengeError } = await supabase
        .from("challenges")
        .select("*")
        .eq("id", challenge_id)
        .single();

    if (challengeError || !challenge) {
        res.status(404).json({ error: "Challenge not found" });
    }

    if (challenge.status !== "open") {
        res.status(400).json({ error: "Challenge is not open for submissions" });
    }

    // Create submission
    const { data, error } = await supabase
        .from("challenge_submissions")
        .insert({
            challenge_id,
            user_id: id,
            submission_url,
            notes,
            status: "pending"
        })
        .select()
        .single();

    if (error) {
        res.status(500).json({ error: error.message });
    }
    res.status(201).json({ data });
}

export const reviewChallenge = async (req: Request, res: Response) => {
    const { id } = req.user; // From auth middleware
    const { submission_id } = req.params;
    const { rating, feedback, status } = req.body;

    // First check if submission exists
    const { data: submission, error: submissionError } = await supabase
        .from("challenge_submissions")
        .select("*")
        .eq("id", submission_id)
        .single();

    if (submissionError || !submission) {
        res.status(404).json({ error: "Submission not found" });
    }

    // Create review
    const { data, error } = await supabase
        .from("challenge_reviews")
        .insert({
            submission_id,
            reviewer_id: id,
            rating,
            feedback,
            status
        })
        .select()
        .single();

    if (error) {
        res.status(500).json({ error: error.message });
    }

    // Update submission status
    await supabase
        .from("challenge_submissions")
        .update({ status })
        .eq("id", submission_id);

    res.status(201).json({ data });
} 