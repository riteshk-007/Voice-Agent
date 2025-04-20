import { Candidate, Conversation, Appointment } from "../models/index.js";

// Get all candidates
export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single candidate
export const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new candidate
export const createCandidate = async (req, res) => {
  try {
    const {
      name,
      phone,
      current_ctc,
      expected_ctc,
      notice_period,
      experience,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const candidate = await Candidate.create({
      name,
      phone,
      current_ctc,
      expected_ctc,
      notice_period,
      experience,
    });

    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a candidate
export const updateCandidate = async (req, res) => {
  try {
    const {
      name,
      phone,
      current_ctc,
      expected_ctc,
      notice_period,
      experience,
    } = req.body;
    const candidate = await Candidate.findByPk(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    await candidate.update({
      name: name || candidate.name,
      phone: phone || candidate.phone,
      current_ctc:
        current_ctc !== undefined ? current_ctc : candidate.current_ctc,
      expected_ctc:
        expected_ctc !== undefined ? expected_ctc : candidate.expected_ctc,
      notice_period:
        notice_period !== undefined ? notice_period : candidate.notice_period,
      experience: experience !== undefined ? experience : candidate.experience,
    });

    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a candidate
export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // First delete all conversations related to this candidate
    await Conversation.destroy({ where: { candidate_id: req.params.id } });

    // Delete all appointments related to this candidate
    await Appointment.destroy({ where: { candidate_id: req.params.id } });

    // Then delete the candidate
    await candidate.destroy();
    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
