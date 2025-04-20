import { Conversation, Candidate } from "../models/index.js";

// Get all conversations
export const getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      include: [{ model: Candidate, attributes: ["id", "name", "phone"] }],
    });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get conversations by candidate ID
export const getConversationsByCandidate = async (req, res) => {
  try {
    const candidateId = req.params.candidateId;

    // Check if candidate exists
    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const conversations = await Conversation.findAll({
      where: { candidate_id: candidateId },
      order: [["created_at", "DESC"]],
    });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single conversation
export const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id, {
      include: [{ model: Candidate, attributes: ["id", "name", "phone"] }],
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { candidate_id, transcript, entities_extracted } = req.body;

    if (!candidate_id || !transcript) {
      return res
        .status(400)
        .json({ message: "Candidate ID and transcript are required" });
    }

    // Check if candidate exists
    const candidate = await Candidate.findByPk(candidate_id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const conversation = await Conversation.create({
      candidate_id,
      transcript,
      entities_extracted: entities_extracted || {},
    });

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a conversation
export const updateConversation = async (req, res) => {
  try {
    const { transcript, entities_extracted } = req.body;
    const conversation = await Conversation.findByPk(req.params.id);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    await conversation.update({
      transcript: transcript || conversation.transcript,
      entities_extracted: entities_extracted || conversation.entities_extracted,
    });

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a conversation
export const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    await conversation.destroy();
    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
