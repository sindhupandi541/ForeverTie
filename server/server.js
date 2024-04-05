import express from "express";
import mysql from "mysql";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin@123",
  database: "marriage",
});

con.connect((err) => {
  if (err) {
    console.log("Error in Connection");
    console.log(err);
  } else {
    console.log("SQL server Connected");
  }
});

const upload = multer({storage:multer.memoryStorage()})
app.post('/uploadImage', upload.array('photos', 12), function (req, res, next) {
  const sql = 'INSERT INTO service_images (service_id, image_data) VALUES (1, ?)';
  const imageData = JSON.stringify(req.files)
  console.log(typeof imageData)
});


app.post("/login", (req, res) => {
  const { Email, Password } = req.body;
  const sql = "SELECT * FROM users WHERE Email = ? AND password = ?";
  con.query(sql, [Email, Password], (err, result) => {
    if (err) {
      return res.json({ status: "Error", error: "Error in running query" });
    }
    if (result.length > 0) {
      console.log(result);
      const { Id, UserType } = result[0];
      if (UserType === "admin" || UserType === "customer") {
        return res.json({ status: UserType, Id });
      }
    }
    return res.json({ status: "Error", message: "User Not found" });
  });
});

app.post("/register", (req, res) => {
  const { FirstName, LastName, Email, PhoneNumber, Password, UserType } = req.body;
  // Check if email already exists
  con.query("SELECT COUNT(*) AS count FROM users WHERE Email = ?", [Email], (err, result) => {
    if (err) {
      console.log("Error checking email existence:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (result[0].count > 0) {
      // Email already exists
      return res.status(400).json({ error: "Email already exists" });
    }
    // Insert user into database
    const sql = "INSERT INTO users (FirstName, LastName, Email, PhoneNumber, Password, UserType) VALUES (?, ?, ?, ?, ?, ?)";
    con.query(sql, [FirstName, LastName, Email, PhoneNumber, Password, UserType], (err, result) => {
      if (err) {
        console.log("Error in registration query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ message: "Registration successful" });
    });
  });
});

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});