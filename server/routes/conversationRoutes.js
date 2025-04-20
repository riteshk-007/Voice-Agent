import express from "express";
import {
  getAllConversations,
  getConversationById,
  getConversationsByCandidate,
  createConversation,
  updateConversation,
  deleteConversation,
} from "../controllers/conversationController.js";

const router = express.Router();

// Conversation routes
router.get("/", getAllConversations);
router.get("/:id", getConversationById);
router.get("/candidate/:candidateId", getConversationsByCandidate);
router.post("/", createConversation);
router.put("/:id", updateConversation);
router.delete("/:id", deleteConversation);

export default router;
