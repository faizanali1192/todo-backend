import { DataTypes } from "sequelize";
import { sequelize } from "../conn/connection";
import { TableNames } from "../constants/constants";

const userModel = sequelize.define(
  TableNames.USERS,
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

const sessionModel = sequelize.define(
  TableNames.SESSION,
  {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expire: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: TableNames.SESSION,
    timestamps: false,
  }
);

export { sessionModel, userModel };
