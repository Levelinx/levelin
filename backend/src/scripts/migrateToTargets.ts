import { supabase } from "../config";

interface Submission {
    id: string;
    proof_url?: string;
    description?: string;
}

interface Target {
    id: string;
    requirements?: string[] | string;
    proof_requirements?: string;
}

/**
 * This script can be run to migrate any remaining data from challenges to targets
 * after the database schema has been updated. It should be run only if necessary.
 */
async function migrateToTargets() {
    console.log("Starting migration from challenges to targets...");

    try {
        // Fetch all submissions that need to be updated
        const { data: submissions, error: submissionsError } = await supabase
            .from("target_submissions")
            .select("id, proof_url, description");

        if (submissionsError) {
            throw submissionsError;
        }

        // Update descriptions for all submissions that have notes but no description
        for (const submission of submissions as Submission[]) {
            if (submission.proof_url && !submission.description) {
                await supabase
                    .from("target_submissions")
                    .update({ description: `Proof: ${submission.proof_url}` })
                    .eq("id", submission.id);
                
                console.log(`Updated submission ${submission.id} with description`);
            }
        }

        // Update any targets that don't have proof_requirements
        const { data: targets, error: targetsError } = await supabase
            .from("targets")
            .select("id, requirements, proof_requirements");

        if (targetsError) {
            throw targetsError;
        }

        for (const target of targets as Target[]) {
            if (target.requirements && !target.proof_requirements) {
                await supabase
                    .from("targets")
                    .update({ 
                        proof_requirements: Array.isArray(target.requirements) 
                            ? target.requirements.join("\n") 
                            : String(target.requirements)
                    })
                    .eq("id", target.id);
                
                console.log(`Updated target ${target.id} with proof requirements`);
            }
        }

        console.log("Migration completed successfully!");
    } catch (error) {
        console.error("Migration failed:", error);
    }
}

// Run the migration
migrateToTargets(); 