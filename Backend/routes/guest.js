import express from "express";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

router.post("/guest-chat", async (req, res) => {
  const message = req.body.message?.trim();

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const reply = await getOpenAIAPIResponse(message);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
