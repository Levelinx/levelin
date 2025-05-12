import { supabase } from "../config";

/**
 * Script to check and fix the targets table schema.
 * This adds the missing difficulty column if needed.
 */
async function main() {
  console.log("Starting fix for targets table...");

  try {
    // Check if difficulty column exists
    const { data: columnsData, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'targets')
      .eq('column_name', 'difficulty');

    if (columnsError) {
      console.error("Error checking columns:", columnsError);
      return;
    }

    // If difficulty column doesn't exist, add it
    if (!columnsData || columnsData.length === 0) {
      console.log("Difficulty column doesn't exist, adding it...");
      
      const { error: alterError } = await supabase
        .rpc('execute_sql', {
          sql_query: "ALTER TABLE public.targets ADD COLUMN difficulty TEXT NOT NULL DEFAULT 'beginner'"
        });

      if (alterError) {
        console.error("Error adding difficulty column:", alterError);
        return;
      }
      
      console.log("Successfully added difficulty column!");
    } else {
      console.log("Difficulty column already exists, no action needed.");
    }

    // Verify the column was added successfully
    const { data: columns, error: verifyError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_schema', 'public')
      .eq('table_name', 'targets');
    
    if (verifyError) {
      console.error("Error verifying table schema:", verifyError);
      return;
    }
    
    console.log("Current targets table columns:");
    console.table(columns);
    
    console.log("Fix completed! Try creating a target now.");
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
  }); 