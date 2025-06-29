// modules
import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// initialize database
export async function initDB() {
  try {
    // constants
    const DATABASE_URL = process.env.DATABASE_URL;

    // creates a sql connection
    const sql = neon(DATABASE_URL);

    await sql`CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY, -- primary key means incremented by 1, eg: 1, 2, 3, 4, ...
        user_id VARCHAR(255) NOT NULL, -- variable character(string/text), of max length of 255 characters
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL, -- 10 digits total, 2 digits after decimal point, eg: 12345678.90
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )`;

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}
