import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Job from "./Job.js";
import Candidate from "./Candidate.js";

const Appointment = sequelize.define("appointment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  job_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Job,
      key: "id",
    },
  },
  candidate_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Candidate,
      key: "id",
    },
  },
  date_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("scheduled", "completed", "cancelled"),
    defaultValue: "scheduled",
  },
});

Appointment.belongsTo(Job, { foreignKey: "job_id" });
Appointment.belongsTo(Candidate, { foreignKey: "candidate_id" });
Job.hasMany(Appointment, { foreignKey: "job_id" });
Candidate.hasMany(Appointment, { foreignKey: "candidate_id" });

export default Appointment;
