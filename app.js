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
        res.redirect('/dashboard/posts');
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
// Rute untuk halaman utama yang menampilkan posting
app.get('/', (req, res) => {
  // Query database untuk mengambil daftar posting
  const query = 'SELECT * FROM blogs';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      res.render('index', { posts: results });
    }
  });
});
// Rute untuk menampilkan dashboard posting
app.get('/dashboard/posts', (req, res) => {
  // Query database untuk mengambil daftar posting
  const query = 'SELECT * FROM blogs';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      res.render('dashboard-posts', { posts: results });
    }
  });
});

// Rute untuk menambahkan posting baru
app.post('/dashboard/posts/create', (req, res) => {
  const { title, content } = req.body;

  // Tangani penambahan posting ke database (INSERT)
  const query = 'INSERT INTO blogs (title, content) VALUES (?, ?)';
  db.query(query, [title, content], (err, results) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/dashboard/posts');
  });
});

app.get('/dashboard/posts/edit/:id', (req, res) => {
  const postId = req.params.id;

  // Query database untuk mengambil posting yang akan diedit
  const query = 'SELECT * FROM blogs WHERE id = ?';
  db.query(query, [postId], (err, result) => {
    if (err) {
      console.error(err);
      res.redirect('/dashboard/posts');
    } else {
      res.render('edit-post', { post: result[0] }); // Ambil posting pertama dari hasil query
    }
  });
});

app.post('/dashboard/posts/edit/:id', (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  // Tangani pengeditan posting di database (UPDATE)
  const query = 'UPDATE blogs SET title = ?, content = ? WHERE id = ?';
  db.query(query, [title, content, postId], (err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/dashboard/posts');
  });
});


// Rute untuk menghapus posting
app.get('/dashboard/posts/delete/:id', (req, res) => {
  const postId = req.params.id;

  // Tangani penghapusan posting dari database (DELETE)
  const query = 'DELETE FROM blogs WHERE id = ?';
  db.query(query, [postId], (err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/dashboard/posts');
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
