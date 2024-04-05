// index.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

// MySQL Connection
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin@123',
  database: 'marriage',
});

con.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM users WHERE email=?';
    con.query(sql, [req.body.email], (err, result) => {
        if (err) return res.json({ Status: "Error", Error: "Error in running query" });
        if (result.length > 0) {
            const userType = result[0].userType;
            if (userType === 'admin') {
                return res.json({ Status: "admin", id: result[0].id,password: result[0].password});
            } else if (userType === 'customer') {
                return res.json({ Status: "customer", id: result[0].id,password: result[0].password});
            }
        } else {
            return res.json({ Status: "Error", message: "No User Found\nClick ok to Register" });
        }
    });
});
const PORT =  8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
