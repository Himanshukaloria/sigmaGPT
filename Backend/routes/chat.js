import express from "express";
import Thread from "../models/thread.js";
const router = express.Router();
import getOpenAIAPIResponse from "../utils/openai.js";

//test
router.post("/test", async (req, res) => {
  const { threadId, title } = req.body;
  try {
    const thread = new Thread({
      threadId: threadId,
      title: title,
      userId: req.userId,
    });

    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save db" });
  }
});

//Get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.userId }).sort({
      updatedAt: -1,
    });
    //here most recent data will be on top
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

//Particular thread info
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId, userId: req.userId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

//Delete thread
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({
      threadId,
      userId: req.userId,
    });
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

//Chat thread
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId, userId: req.userId });
    if (!thread) {
      //create a new thread
      thread = new Thread({
        threadId,
        title: message,
        userId: req.userId,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }
    console.log("callinggroq with", message);

    //openai api calling
    const assistantReply = await getOpenAIAPIResponse(message);
    console.log("groq reply", assistantReply);
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();
    res.json({ reply: assistantReply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
