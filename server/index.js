// modules
import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.config.js";

dotenv.config();

const app = express();

// constants
const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
  return res.send({ message: "Server is running", success: true });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
  });
});
