// pages/api/markWord.js
import { supabase } from "../../utils/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, correct } = req.body;

  // fetch current record
  let { data: oldWord, error: fetchErr } = await supabase
    .from("vocab_words")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !oldWord) {
    return res.status(404).json({ error: "Word not found" });
  }

  let newInterval = correct ? oldWord.interval * 2 : 1;

  let nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);
  let nextReviewDate = nextDate.toISOString().split("T")[0];

  // update record
  let { data, error: updateErr } = await supabase
    .from("vocab_words")
    .update({
      interval: newInterval,
      next_review_date: nextReviewDate,
    })
    .eq("id", id)
    .select();

  if (updateErr) {
    return res.status(400).json({ error: updateErr.message });
  }

  res.status(200).json(data[0]);
}
