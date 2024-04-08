import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";

export const createDailyScrumUpdateAnswers = async (
  entryId: number,
  answersValues: Required<
    Pick<
      Database["public"]["Tables"]["daily_scrum_update_answers"]["Insert"],
      "daily_scrum_update_question_id" | "answer"
    >
  >[]
) => {
  const client = createClient<Database>();

  return client.from("daily_scrum_update_answers").insert(
    answersValues.map((answer) => ({
      ...answer,
      daily_scrum_update_entry_id: entryId,
    }))
  );
};
