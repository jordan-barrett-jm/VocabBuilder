// pages/api/getDueWords.js
import { supabase } from "../../utils/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // fetch words whose nextReviewDate <= today
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("vocab_words")
    .select("*")
    .lte("next_review_date", today)
    .order("created_at", { ascending: true });

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json(data);
}
