import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getSummary,
} from "../controllers/transactions.controller.js";

const router = express.Router();

router.post("/", createTransaction);

router.get("/:userId", getAllTransactions);

router.delete("/:transactionId", deleteTransaction);

router.get("/summary/:userId", getSummary);

export default router;
