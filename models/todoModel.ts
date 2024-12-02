import { DataTypes } from "sequelize";
import { sequelize } from "../conn/connection";
import { TableNames } from "../constants/constants";

const todosModel = sequelize.define(
  TableNames.TODOS,
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

export { todosModel };
