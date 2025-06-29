export const createTransaction = async (req, res) => {
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
};

export const getAllTransactions = async (req, res) => {
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
};

export const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Convert to number and validate
    const id = parseInt(transactionId);

    // Check if conversion was successful and number is positive
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid transaction ID format. Must be a positive number",
        success: false,
      });
    }

    const deletedTransaction = await sql`
    DELETE FROM transactions WHERE id = ${id} RETURNING *`;

    if (deletedTransaction.length === 0) {
      return res.status(404).json({
        message: "Transaction not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Transaction deleted successfully",
      success: true,
      deletedTransaction,
    });
  } catch (error) {
    console.error("Error in delete transaction controller: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql` -- get balance for user
    SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}`;

    const incomeResult = await sql` -- amount>0:income, amount<0:expense
    SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0`;

    const expenseResult = await sql` -- amount>=0:income, amount<0:expense
    SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0`;

    return res.status(200).json({
      message: "Got user balance successfully",
      success: true,
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expenseResult[0].expenses,
    });
  } catch (error) {
    console.error("Error in get transaction summary controller: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
