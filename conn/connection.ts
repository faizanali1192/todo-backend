import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("todo", "postgres", "admin", {
  host: "localhost",
  port: 5432, // Assuming the default PostgreSQL port is used
  dialect: "postgres",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
