import Job from "./Job.js";
import Candidate from "./Candidate.js";
import Appointment from "./Appointment.js";
import Conversation from "./Conversation.js";
import sequelize from "../config/database.js";

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync all models with the database
    // Use force:true to drop and recreate tables (WARNING: This will delete existing data)
    // After the first successful run, change this back to alter:true
    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { Job, Candidate, Appointment, Conversation, syncDatabase };
