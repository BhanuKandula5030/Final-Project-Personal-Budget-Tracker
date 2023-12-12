const sqlite = require('better-sqlite3');
const db = sqlite('users.db');

const createUsersTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    lastName TEXT,
    username TEXT,
    password TEXT
  )
`);
createUsersTable.run();

const createTransactionsTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    category TEXT,
    amount REAL,
    description TEXT
  )
`);
createTransactionsTable.run();

const createBudgetSummaryTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS budget_summary (
    user_id INTEGER PRIMARY KEY,
    income REAL,
    expenses REAL,
    savings REAL,
    net_balance REAL,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )
`);
createBudgetSummaryTable.run();

module.exports = db;