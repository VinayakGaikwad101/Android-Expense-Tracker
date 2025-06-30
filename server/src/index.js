// modules
import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.config.js";
import rateLimiter from "./middlewares/rateLimiter.middleware.js";
import transactionsRouter from "./routes/transactions.route.js";

dotenv.config();

const app = express();

// middleware
app.use(rateLimiter);
app.use(express.json()); // to get access to req.body

// constants
const PORT = process.env.PORT || 5001;

// TODO: remove GET at "/" for production
app.get("/", (req, res) => {
  return res.send({ message: "Server is running", success: true });
});

app.use("/api/transactions", transactionsRouter);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
  });
});
