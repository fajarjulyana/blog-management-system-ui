// app.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./db');

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Rute untuk tampilan halaman login
app.get('/login', (req, res) => {
  res.render('login');
});

// Rute untuk menangani data login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Gantilah query berikut sesuai dengan struktur tabel dan kolom di database Anda
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      res.redirect('/login');
    } else {
      if (results.length > 0) {
        req.session.user = username;
        res.redirect('/dashboard');
      } else {
        res.redirect('/login');
      }
    }
  });
});

// Rute untuk halaman dashboard (contoh)
app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.send('Selamat datang di dashboard, ' + req.session.user + '!');
  } else {
    res.redirect('/login');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
