import { Job } from "../models/index.js";

// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single job
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new job
export const createJob = async (req, res) => {
  try {
    const { title, description, requirements } = req.body;

    if (!title || !description || !requirements) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await Job.create({
      title,
      description,
      requirements,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a job
export const updateJob = async (req, res) => {
  try {
    const { title, description, requirements } = req.body;
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.update({
      title: title || job.title,
      description: description || job.description,
      requirements: requirements || job.requirements,
    });

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.destroy();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
