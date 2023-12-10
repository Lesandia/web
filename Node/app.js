const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = 3000;
const transactionsFilePath = path.join(__dirname, "transactions.json");

app.use(bodyParser.json());

let transactions = [];

app.get("/api/transactions", (req, res) => {
  console.log("GET request received for /api/transactions");
  res.json(transactions);
});

app.post("/api/transactions", async (req, res) => {
  console.log("POST request received for /api/transactions");
  const newTransaction = req.body;
  transactions.push(newTransaction);
  await saveTransactionsToJson();
  res.status(201).json(newTransaction);
});

app.delete("/api/transactions/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE request received for /api/transactions/${id}`);
  transactions = transactions.filter((transaction) => transaction.id !== id);
  await saveTransactionsToJson();
  res.status(200).json({ message: "Transaction deleted successfully" });
});

async function saveTransactionsToJson() {
  try {
    await fs.writeFile(transactionsFilePath, JSON.stringify(transactions, null, 2));
  } catch (error) {
    console.error("Error saving transactions to file:", error);
  }
}

(async () => {
  try {
    const data = await fs.readFile(transactionsFilePath);
    transactions = JSON.parse(data);
  } catch (error) {
    console.error("Error reading transactions from file:", error);
    await fs.writeFile(transactionsFilePath, JSON.stringify(transactions, null, 2));
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
