import express from "express";
import mysql from "mysql";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
// import { rows } from "mssql";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Admin@123",
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

app.post("/uploadImage",upload.single('image'), (req, res) => {
  const serviceId = req.body.service_id;
  const image = req.file.buffer.toString('base64');
  const sql = "INSERT INTO service_images (service_id, image_data) VALUES (?, ?)";
  con.query(sql,[serviceId,image],(err, result) => {
    if (err) {
      console.log("Error in registration query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json({ message: "Registration successful" });
  });

  console.log(image);
  
});

app.get('/getServiceImages',(req,res)=>{
  const sql="SELECT * FROM service_images";
  con.query(sql,(err,result)=>{
      if(err) return res.json({Error:"Got an error in the sql"});
      return res.json({Status:"Success",Result:result})
  })
})
app.listen(8081, () => {
  console.log("Server is running on port 8081");
});