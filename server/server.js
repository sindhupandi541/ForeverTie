import express from "express";
import mysql from "mysql";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
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
  con.query("SELECT COUNT(*) AS count FROM users WHERE Email = ?", [Email], (err, result) => {
    if (err) {
      console.log("Error checking email existence:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (result[0].count > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }
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
  
});

app.get('/getServices', (req, res) => {
  const date = req.query.date;
  const address = req.query.address;
  // console.log(address);
  const sql = `SELECT s.*
  FROM services_with_limited_images AS s
  LEFT JOIN bookings AS b ON b.serviceId = s.id AND b.bookingDate = ? 
  WHERE b.serviceId IS NULL and s.address =?;
  `;
  con.query(sql, [date,address], (err, result) => {
    if (err) return res.json({ Error: "Got an error in the sql" });
    return res.json({ Status: "Success", Result: result })
  })
})


app.get('/adminServices', async (req, res) => {
  const sql = 'SELECT * FROM services_with_limited_images order by name';
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Got an error in the sql" });
    return res.json({ Status: "Success", Result: result })
  })
});


app.get('/filter',(req,res)=>{
  const sql="SELECT address FROM services";
  con.query(sql,(err,result)=>{
      if(err) return res.json({Error:"Got an error in the sql"});
      return res.json({Status:"Success",Result:result})
  })
})

app.get('/ServiceDetails/:id', (req, res) => {
  const { id } = req.params;
  const detailsQuery = "SELECT * FROM services WHERE id = ?";
  const imagesQuery = "SELECT * FROM service_images WHERE service_id = ?";
  con.query(detailsQuery, [id], (err1, detailsResults) => {
    if (err1) {
      console.error('Error executing MySQL query:', err1);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
        if (detailsResults.length === 0) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    con.query(imagesQuery, [id], (err2, imagesResults) => {
      if (err2) {
        console.error('Error executing MySQL query:', err2);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      const serviceDetails = detailsResults[0];
      const images = imagesResults;
      res.json({ serviceDetails, images });
    });
  });
});

app.post('/addToCart', async (req, res) => {
  const { userId, serviceId, price, totalPrice } = req.body;
  try {
    const sql = 'INSERT INTO Cart (UserId, ServiceId, Price, TotalPrice) VALUES (?, ?, ?, ?)';
    await con.query(sql, [userId, serviceId, price, totalPrice],(err, result) => {
      if (err) {
        console.log("Error in registration query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ message: "Service added to cart successfully." });
    });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Failed to add service to cart.' });
  }
});

app.post('/getCart', (req, res) => {
  const { userId } = req.body;
  const sql = `
  SELECT c.*, s.name AS serviceName, s.address AS serviceAddress, s.capacity AS serviceCapacity, s.rate AS serviceRate ,s.category as ServiceCategory ,s.image_data as ServiceImage
  FROM Cart c
  LEFT JOIN services_with_limited_images s ON c.ServiceId = s.id
  WHERE c.UserId = ?
`;
  
  try {
    con.query(sql, [userId], (err, result) => {
      if (err) {
        return res.json({ status: "Error", error: "Error in running query" });
      }
      if (result.length > 0) {
        res.json(result);
      } else {
        res.json({ status: "Empty", message: "Cart is empty" });
      }
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/deleteCartItem', async (req, res) => {
  const { userId, itemId } = req.body;

  try {
    const sql = 'DELETE FROM Cart WHERE UserId = ? AND CartId = ?';
    await con.query(sql, [userId, itemId], (err, result) => {
      if (err) {
        console.log("Error deleting item from cart:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ message: "Item deleted from cart successfully." });
    });
  } catch (error) {
    console.error('Error deleting item from cart:', error);
    res.status(500).json({ status: 'Error', message: 'Failed to delete item from cart.' });
  }
});

app.post('/checkCartItem', async (req, res) => {
  const { userId, serviceId } = req.body;
  try {
    const sql = 'SELECT * FROM Cart WHERE UserId = ? AND ServiceId = ?';
    con.query(sql, [userId, serviceId], (err, result) => {
      if (err) {
        console.error('Error checking cart item:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (result.length > 0) {
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    });
  } catch (error) {
    console.error('Error checking cart item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/paymentHistory', (req, res) => {
  const { userId } = req.body;
  const sql = `
    SELECT b.*, s.name, s.category
    FROM bookings AS b
    INNER JOIN services AS s ON b.serviceId = s.id
    WHERE b.userId = ?
  `;

  con.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching payment history:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ status: 'Success', paymentHistory: result });
  });
});


app.post('/book', (req, res) => {
  const { userId, serviceId, totalPayment, paymentMode, bookingDate, paymentStatus } = req.body;
  const sql = `INSERT INTO bookings (userId, serviceId, totalPayment, paymentMode, bookingDate, paymentStatus) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [userId, serviceId, totalPayment, paymentMode, bookingDate, paymentStatus];
  con.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting booking:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ message: 'Booking inserted successfully', bookingId: result.insertId });
  });
});

app.delete('/emptyCart/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'DELETE FROM cart WHERE UserId = ?';
  con.query(sql, [userId], (err, result) => {
      if (err) {
          console.error('Error emptying cart:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }
      return res.json({ status: "Success" });
  });
});

app.post('/addService', (req, res) => {
  const { name, address, capacity, rate, category } = req.body;
  const sql = `INSERT INTO services (name, address, capacity, rate, category) VALUES (?, ?, ?, ?, ?)`;
  const values = [name, address, capacity, rate, category];
  con.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json({ status: 'success', message: 'Service inserted successfully', id: result.insertId });
  });
});


app.delete('/deleteService/:serviceId', async (req, res) => {
  const serviceId = req.params.serviceId;
console.log(serviceId);
    con.query('DELETE FROM services WHERE id = ?', serviceId, function(err, result) {
      if (err) { 
        return res.status(500).json({ success: false, message: 'Error deleting from services table' });
      }
            res.json({ success: true, message: 'Successfully Deleted' });
    });
    con.query('DELETE FROM service_images WHERE service_id = ?',serviceId);
});

app.get('/getUpdatingService', (req, res) => {
  const id = req.query.id;
  let queryResult={};
  con.query('select * from services where id = ?', [id], (err, result) => {
    if (err) return res.json({ Error: "Got an error in the sql" });
    queryResult.services = result;
  })
  con.query('select image_data from service_images where service_id = ?', [id], (err, result) => {
    if (err) return res.json({ Error: "Got an error in the sql" });
    queryResult.service_images = result;
    return res.json({ Status: "Success", Result: queryResult })    
  })
})

app.post('/payments', (req, res) => {
  const sql = `SELECT u.FirstName, u.LastName, s.name AS serviceName,s.category, b.*
  FROM bookings AS b
  left JOIN users AS u ON b.userId = u.id
  left JOIN services AS s ON s.id =b.serviceId`;

  con.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching payment history:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ status: 'Success', paymentHistory: result });
  });
});


app.put('/updateService', (req, res) => {
  const { id, name, address, rate,capacity } = req.body;
  const sql = `UPDATE services SET name = ?, address = ?, capacity = ?, rate = ? WHERE id = ?`;
  con.query(sql, [name, address,capacity, rate,id], (err, result) => {
      if (err) {
          console.log("Error updating venue:", err);
          return res.status(500).json({ error: "Internal Server Error" });
      }

      res.json({ message: "updated successfully", id });
  });
});

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
