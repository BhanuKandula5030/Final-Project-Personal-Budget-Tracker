const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();
const port = 3002;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.render('introduction');
});
app.get('/login', (req, res) => {
  res.render('login');
});
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
  if (user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login?error=1');
  }
});
app.get('/signup', (req, res) => {
  res.render('signup');
});
app.post('/signup', (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  const insertUser = db.prepare('INSERT INTO users (firstName, lastName, username, password) VALUES (?, ?, ?, ?)');
  insertUser.run(firstName, lastName, username, password);
  res.redirect('/login');
});
app.get('/dashboard', (req, res) => {
  const recentTransactions = db.prepare('SELECT * FROM transactions ORDER BY date DESC LIMIT 5').all();
  let netBalance = 0;
  let income = 0;
  let expenses = 0;
  let savings = 0;

  recentTransactions.forEach(transaction => {
    if (transaction.category === 'income') {
      income += transaction.amount;
    } else if (transaction.category === 'expenses') {
      expenses += transaction.amount;
    } else if (transaction.category === 'savings') {
      savings += transaction.amount;
    }
  });

  netBalance = income - expenses + savings;

  res.render('dashboard', {
    recentTransactions,
    netBalance,
    income,
    expenses,
    savings,
  });
});

app.get('/expense-tracking', (req, res) => {
  res.render('expense-tracking');
});
app.post('/add-expense', (req, res) => {
  const { date, category, amount, description } = req.body;
  db.prepare('INSERT INTO transactions (date, category, amount, description) VALUES (?, ?, ?, ?)').run(date, category, amount, description);
  res.redirect('/expense-tracking');
});
app.get('/spending-alert', (req, res) => {
  const expenseLimit = null; 
  const expenseLimitLocked = expenseLimit !== null;
  res.render('spending-alert', { expenseLimit, expenseLimitLocked });
});
app.post('/process-spending-alert', (req, res) => {
  const { expenseLimit, action } = req.body;
  if (action === 'acknowledge') {
    res.redirect('/dashboard');
  } else if (action === 'adjustLimit') {
    const expenseLimitLocked = expenseLimit !== null;
    res.render('spending-alert', { expenseLimit, expenseLimitLocked });
  }
});
app.get('/logout', (req, res) => {
  res.redirect('/login');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
