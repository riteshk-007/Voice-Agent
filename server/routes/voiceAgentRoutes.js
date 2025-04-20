import express from "express";
import {
  startConversation,
  processResponse,
  simulateCall,
} from "../controllers/voiceAgentController.js";

const router = express.Router();

// Voice agent routes
router.post("/start", startConversation);
router.post("/process", processResponse);
router.post("/simulate", simulateCall);

export default router;
