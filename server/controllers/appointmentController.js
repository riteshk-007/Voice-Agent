import { Appointment, Job, Candidate } from "../models/index.js";

// Get all appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: Job, attributes: ["id", "title"] },
        { model: Candidate, attributes: ["id", "name", "phone"] },
      ],
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single appointment
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: Job, attributes: ["id", "title", "description"] },
        { model: Candidate, attributes: ["id", "name", "phone"] },
      ],
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const { job_id, candidate_id, date_time, status } = req.body;

    if (!job_id || !candidate_id || !date_time) {
      return res
        .status(400)
        .json({ message: "Job ID, Candidate ID, and Date/Time are required" });
    }

    // Check if job exists
    const job = await Job.findByPk(job_id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if candidate exists
    const candidate = await Candidate.findByPk(candidate_id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const appointment = await Appointment.create({
      job_id,
      candidate_id,
      date_time,
      status: status || "scheduled",
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an appointment
export const updateAppointment = async (req, res) => {
  try {
    const { job_id, candidate_id, date_time, status } = req.body;
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // If job_id is provided, check if it exists
    if (job_id) {
      const job = await Job.findByPk(job_id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
    }

    // If candidate_id is provided, check if it exists
    if (candidate_id) {
      const candidate = await Candidate.findByPk(candidate_id);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
    }

    await appointment.update({
      job_id: job_id || appointment.job_id,
      candidate_id: candidate_id || appointment.candidate_id,
      date_time: date_time || appointment.date_time,
      status: status || appointment.status,
    });

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await appointment.destroy();
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
