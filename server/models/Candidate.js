import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Candidate = sequelize.define("candidate", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  current_ctc: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  expected_ctc: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  notice_period: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  experience: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

export default Candidate;
