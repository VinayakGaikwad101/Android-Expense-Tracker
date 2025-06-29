// modules
import express from "express";
import dotenv from "dotenv";
import { initDB, sql } from "./config/db.config.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json()); // to get access to req.body

// constants
const PORT = process.env.PORT || 5001;

// TODO: remove GET at "/" for production
app.get("/", (req, res) => {
  return res.send({ message: "Server is running", success: true });
});

app.post("/api/transactions", async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;

    // no fields
    if (!user_id || !title || !category || amount === undefined) {
      return res
        .status(400)
        .json({ message: "All fields required", success: false });
    }

    // insert transaction in the table
    const transaction = await sql`
    INSERT INTO transactions(user_id, title, category, amount)
    VALUES(${user_id}, ${title}, ${category}, ${amount})
    RETURNING *
    `;

    return res.status(201).json({
      message: "Successfully created transaction in table",
      success: true,
      transaction,
    });
  } catch (error) {
    console.error("Error in create transaction controller: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
});

app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await sql`
    SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for user", success: false });
    }

    return res.status(200).json({
      message: "User transactions found!",
      success: true,
      transactions,
    });
  } catch (error) {
    console.error("Error in get transaction controller: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
  });
});
