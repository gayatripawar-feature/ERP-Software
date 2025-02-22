


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const mysql = require('mysql2');
const tasksHandler = require('./routes/tasks'); 
// const doertasks = require('./routes/doertasks');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const JWT_SECRET = process.env.JWT_SECRET;
const axios = require('axios');
// const fs = require('fs');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ Use the router
app.use('/api', tasksHandler);
// app.use('/api',doertasks);
app.use('/api', require('./routes/doertasks'));


const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
  console.log('Token received:', token);
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'mysecretkey12345', (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' });
      } else {
        return res.status(401).json({ message: 'Invalid token' });
      }
    }
    
    req.userId = decoded.user_id; // Assuming `id` is stored in the token, or use `user_id`
    console.log('Authenticated user ID:', req.userId);
    next(); // Proceed to the next middleware or route handler
  });
};

// const authenticateUser = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
//   console.log('Token received:', token);
  
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   jwt.verify(token, 'mysecretkey12345', (err, decoded) => {
//     if (err) {
//       if (err.name === 'TokenExpiredError') {
//         return res.status(401).json({ message: 'Token has expired' });
//       } else {
//         return res.status(401).json({ message: 'Invalid token' });
//       }
//     }

//     // Here we extract email from the decoded token
//     req.email = decoded.email; // Assuming `email` is stored in the token
//     console.log('Authenticated user email:', req.email);

//     next(); // Proceed to the next middleware or route handler
//   });
// };


// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'employee_system'
});

db.connect((err) => {
  if (err) console.error('Database connection failed:', err);
  else console.log('Connected to MySQL database');
});

// Register route
app.post('/api/register', async (req, res) => {
  console.log('Register route hit');
  const { username, email, phoneNumber, designation, dob, dateOfJoining, password, confirmPassword } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
   
    const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    
    const query = 'INSERT INTO users (username, email, phoneNumber, designation, dob, dateOfJoining, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
    await db.promise().query(query, [username, email, phoneNumber, designation, dob, dateOfJoining, password]);

    
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



// Login route

  app.post('/login', async(req, res) => {
  console.log('Login attempt:', req.body);
  const { email, password } = req.body;

  try {
    const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // Compare input password to the stored plain-text password
    if (password === user.password) {
      // If password matches, generate a token
      // const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      // res.status(200).json({ message: 'Login successful', token });
      const token = jwt.sign({ user_id: user.user_id }, 'mysecretkey12345', { expiresIn: '1h' });
     

      res.status(200).json({ message: 'Login successful', token });

    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
