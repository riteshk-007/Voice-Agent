import { Candidate, Conversation, Appointment, Job } from "../models/index.js";

// Helper function to extract entities from text using regex
const extractEntities = (text) => {
  const entities = {};

  // Extract CTC amounts (e.g., "10 LPA", "10.5 lakhs", "12,50,000")
  const ctcRegex = /(\d+(\.\d+)?(\s)?(lpa|lakhs|l|k|cr|crore))|(\d+,\d+,\d+)/gi;
  const ctcMatches = text.match(ctcRegex);
  if (ctcMatches) {
    entities.ctc = ctcMatches;
  }

  // Extract notice period (e.g., "30 days", "2 months", "3 weeks")
  const noticeRegex = /(\d+(\.\d+)?(\s)?(days?|weeks?|months?))/gi;
  const noticeMatches = text.match(noticeRegex);
  if (noticeMatches) {
    entities.notice_period = noticeMatches;
  }

  // Extract dates (e.g., "next Monday", "on 25th", "tomorrow")
  const dateRegex =
    /(next|this)?\s?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)|(\d{1,2}(st|nd|rd|th)?(\s)?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)(\s)?(\d{4})?)|tomorrow|day after tomorrow/gi;
  const dateMatches = text.match(dateRegex);
  if (dateMatches) {
    entities.date = dateMatches;
  }

  // Extract time (e.g., "10 AM", "2:30 PM", "14:00 hours")
  const timeRegex =
    /(\d{1,2}:\d{2})(\s)?(am|pm|hrs|hours)?|(\d{1,2})(\s)?(am|pm)/gi;
  const timeMatches = text.match(timeRegex);
  if (timeMatches) {
    entities.time = timeMatches;
  }

  return entities;
};

// Start voice agent conversation with a candidate
export const startConversation = async (req, res) => {
  try {
    const { candidate_id, job_id } = req.body;

    if (!candidate_id || !job_id) {
      return res
        .status(400)
        .json({ message: "Candidate ID and Job ID are required" });
    }

    // Check if candidate exists
    const candidate = await Candidate.findByPk(candidate_id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Check if job exists
    const job = await Job.findByPk(job_id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Create initial greeting
    const greeting = `Hello ${candidate.name}, this is regarding a ${job.title} opportunity. Are you interested in this role?`;

    // Create initial conversation entry
    const conversation = await Conversation.create({
      candidate_id,
      transcript: `System: ${greeting}`,
      entities_extracted: {},
    });

    res.status(200).json({
      message: "Conversation started successfully",
      conversation_id: conversation.id,
      greeting,
      next_question: "interest_confirmation",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Process candidate response and determine next question
export const processResponse = async (req, res) => {
  try {
    const { conversation_id, response, current_step } = req.body;

    if (!conversation_id || !response || !current_step) {
      return res.status(400).json({
        message: "Conversation ID, response, and current step are required",
      });
    }

    // Get the conversation
    const conversation = await Conversation.findByPk(conversation_id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Get the candidate
    const candidate = await Candidate.findByPk(conversation.candidate_id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Extract entities from the response
    const entities = extractEntities(response);

    // Update the conversation transcript
    const updatedTranscript = `${conversation.transcript}\nCandidate: ${response}`;

    // Determine next question and update candidate info based on current step
    let nextQuestion = "";
    let nextStep = "";
    let systemResponse = "";

    switch (current_step) {
      case "interest_confirmation":
        // Check if response indicates interest
        if (
          response.toLowerCase().includes("yes") ||
          response.toLowerCase().includes("interested")
        ) {
          systemResponse = "Great! What is your current notice period?";
          nextStep = "notice_period";
        } else {
          systemResponse =
            "I understand. Thank you for your time. Would you like us to contact you for future opportunities?";
          nextStep = "end_conversation";
        }
        break;

      case "notice_period":
        // Update candidate notice period if extracted
        if (entities.notice_period && entities.notice_period.length > 0) {
          // Simple conversion to days - could be more sophisticated
          let noticePeriod = 0;
          const notice = entities.notice_period[0].toLowerCase();

          if (notice.includes("day")) {
            noticePeriod = parseInt(notice.match(/\d+/)[0]);
          } else if (notice.includes("week")) {
            noticePeriod = parseInt(notice.match(/\d+/)[0]) * 7;
          } else if (notice.includes("month")) {
            noticePeriod = parseInt(notice.match(/\d+/)[0]) * 30;
          }

          await candidate.update({ notice_period: noticePeriod });
        }

        systemResponse = "Can you share your current and expected CTC?";
        nextStep = "ctc_information";
        break;

      case "ctc_information":
        // Update candidate CTC if extracted
        if (entities.ctc && entities.ctc.length > 0) {
          if (entities.ctc.length >= 2) {
            // Assuming first match is current CTC, second is expected
            const currentCtcStr = entities.ctc[0];
            const expectedCtcStr = entities.ctc[1];

            // Simple parsing - could be more sophisticated
            let currentCtc = parseFloat(currentCtcStr.replace(/[^0-9.]/g, ""));
            let expectedCtc = parseFloat(
              expectedCtcStr.replace(/[^0-9.]/g, "")
            );

            // Convert to uniform format (e.g., lakhs)
            if (
              currentCtcStr.toLowerCase().includes("cr") ||
              currentCtcStr.toLowerCase().includes("crore")
            ) {
              currentCtc *= 100; // Convert crore to lakhs
            }

            if (
              expectedCtcStr.toLowerCase().includes("cr") ||
              expectedCtcStr.toLowerCase().includes("crore")
            ) {
              expectedCtc *= 100; // Convert crore to lakhs
            }

            await candidate.update({
              current_ctc: currentCtc,
              expected_ctc: expectedCtc,
            });
          }
        }

        systemResponse = "When are you available for an interview next week?";
        nextStep = "interview_availability";
        break;

      case "interview_availability":
        // Process date and time for scheduling
        let scheduledDate = null;

        if (
          entities.date &&
          entities.date.length > 0 &&
          entities.time &&
          entities.time.length > 0
        ) {
          // Simple date and time extraction - would need more sophisticated parsing in production
          const dateStr = entities.date[0];
          const timeStr = entities.time[0];

          // Create a tentative date/time - this is simplified
          const now = new Date();
          scheduledDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Example: 1 week from now

          // In a real implementation, we would parse dateStr and timeStr more accurately

          systemResponse = `We've scheduled your interview on ${scheduledDate.toLocaleDateString()} at ${timeStr}. Is that correct?`;
          nextStep = "confirm_appointment";
        } else {
          systemResponse =
            "I didn't catch your preferred date and time. Could you please specify when you would be available next week?";
          nextStep = "interview_availability";
        }
        break;

      case "confirm_appointment":
        // Check if response confirms appointment
        if (
          response.toLowerCase().includes("yes") ||
          response.toLowerCase().includes("correct")
        ) {
          // Create appointment
          // In a real implementation, we would have the actual date parsed and stored

          // For this demo, we'll create a placeholder appointment
          const oneWeekFromNow = new Date();
          oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

          await Appointment.create({
            candidate_id: candidate.id,
            job_id: 1, // We should get this from the conversation context in a real app
            date_time: oneWeekFromNow,
            status: "scheduled",
          });

          systemResponse =
            "Great! Your interview has been scheduled. You will receive a confirmation email shortly. Is there anything else you would like to know about the position?";
          nextStep = "additional_questions";
        } else {
          systemResponse =
            "I understand. Let's try again. When would be a good time for you next week?";
          nextStep = "interview_availability";
        }
        break;

      case "additional_questions":
        // Handle any additional questions from the candidate
        systemResponse =
          "Thank you for your time. We look forward to speaking with you at your scheduled interview. Have a great day!";
        nextStep = "end_conversation";
        break;

      case "end_conversation":
        // End the conversation
        systemResponse = "Thank you for your time. Goodbye!";
        nextStep = "complete";
        break;

      default:
        systemResponse =
          "I'm not sure what to ask next. Let me connect you with a human recruiter.";
        nextStep = "end_conversation";
    }

    // Update the conversation with the system response
    const finalTranscript = `${updatedTranscript}\nSystem: ${systemResponse}`;

    // Update the conversation in the database
    await conversation.update({
      transcript: finalTranscript,
      entities_extracted: { ...conversation.entities_extracted, ...entities },
    });

    res.status(200).json({
      message: "Response processed successfully",
      next_question: systemResponse,
      next_step: nextStep,
      entities_extracted: entities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Simulate a voice call for testing
export const simulateCall = async (req, res) => {
  try {
    const { candidate_id, job_id, responses } = req.body;

    if (!candidate_id || !job_id || !responses || !Array.isArray(responses)) {
      return res.status(400).json({
        message: "Candidate ID, Job ID, and an array of responses are required",
      });
    }

    // Check if candidate exists
    const candidate = await Candidate.findByPk(candidate_id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Check if job exists
    const job = await Job.findByPk(job_id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Create initial greeting
    const greeting = `Hello ${candidate.name}, this is regarding a ${job.title} opportunity. Are you interested in this role?`;

    // Start with the greeting
    let transcript = `System: ${greeting}\n`;
    let currentStep = "interest_confirmation";
    let allEntities = {};

    // Process each response
    for (const response of responses) {
      // Add candidate response to transcript
      transcript += `Candidate: ${response}\n`;

      // Extract entities
      const entities = extractEntities(response);
      allEntities = { ...allEntities, ...entities };

      // Determine next question based on current step
      let nextQuestion = "";

      switch (currentStep) {
        case "interest_confirmation":
          nextQuestion = "What is your current notice period?";
          currentStep = "notice_period";
          break;

        case "notice_period":
          nextQuestion = "Can you share your current and expected CTC?";
          currentStep = "ctc_information";
          break;

        case "ctc_information":
          nextQuestion = "When are you available for an interview next week?";
          currentStep = "interview_availability";
          break;

        case "interview_availability":
          nextQuestion =
            "We've scheduled your interview for next Monday at 10 AM. Is that correct?";
          currentStep = "confirm_appointment";
          break;

        case "confirm_appointment":
          nextQuestion =
            "Great! Your interview has been scheduled. You will receive a confirmation email shortly. Is there anything else you would like to know about the position?";
          currentStep = "additional_questions";
          break;

        case "additional_questions":
          nextQuestion =
            "Thank you for your time. We look forward to speaking with you at your scheduled interview. Have a great day!";
          currentStep = "end_conversation";
          break;

        case "end_conversation":
          nextQuestion = "Goodbye!";
          currentStep = "complete";
          break;

        default:
          nextQuestion =
            "I'm not sure what to ask next. Let me connect you with a human recruiter.";
          currentStep = "end_conversation";
      }

      // Add system response to transcript
      transcript += `System: ${nextQuestion}\n`;

      // If conversation is complete, break the loop
      if (currentStep === "complete") {
        break;
      }
    }

    // Create a conversation record
    const conversation = await Conversation.create({
      candidate_id,
      transcript,
      entities_extracted: allEntities,
    });

    // If conversation reached confirmation stage, create an appointment
    if (
      currentStep === "additional_questions" ||
      currentStep === "end_conversation" ||
      currentStep === "complete"
    ) {
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

      await Appointment.create({
        candidate_id,
        job_id,
        date_time: oneWeekFromNow,
        status: "scheduled",
      });
    }

    res.status(200).json({
      message: "Call simulation completed successfully",
      conversation_id: conversation.id,
      transcript,
      entities_extracted: allEntities,
      final_step: currentStep,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
