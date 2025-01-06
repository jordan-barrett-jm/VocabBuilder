// pages/api/addWord.js
import { supabase } from "../../utils/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { word, definition } = req.body;
  // default scheduling: interval = 1, next_review_date = today
  const { data, error } = await supabase
    .from("vocab_words")
    .insert([{ word, definition }])
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json(data[0]);
}
