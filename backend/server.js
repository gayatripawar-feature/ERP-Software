


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const mysql = require('mysql2');
const tasksHandler = require('./routes/tasks'); 
const doertasks = require('./routes/doertasks');
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
app.use('/api',doertasks);


// Middleware to verify the token and add user ID to the request
// const authenticateUser = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"

//   if (!token) {
//     return res.status(401).json({ message: 'Authentication token is required' });
//   }

//   try {
//     const decoded = jwt.verify(token, 'mysecretkey12345'); // Replace with your secret key
//     req.userId = decoded.userId; // Assuming the token contains userId
//     next(); // Proceed to the next middleware/route handler
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

// // app.use(authenticateUser);

// const authenticateUser = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1];
//   console.log('Token received:', token);  // Log the token
  
//   if (!token) {
//     return res.status(401).json({ message: 'Authentication token is required' });
//   }
  
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);  // Ensure your JWT_SECRET is correct
//     console.log('Decoded user:', decoded);  // Log decoded token
//     req.userId = decoded.id;
//     next();
//   } catch (error) {
//     console.error('JWT error:', error);
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

// const authenticateUser = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
//   console.log('Token received:', token);
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   jwt.verify(token, 'mysecretkey12345', (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//     req.userId = decoded.id; // Assuming `id` is stored in the token
//     next();
//     console.log('Authenticated user ID:', req.userId);

//   });
// };
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
    // Check if the email already exists
    const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Store password as plain text
    const query = 'INSERT INTO users (username, email, phoneNumber, designation, dob, dateOfJoining, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
    await db.promise().query(query, [username, email, phoneNumber, designation, dob, dateOfJoining, password]);

    // Send success response
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




app.get('/api/getWeeklyTasks/:user_id', authenticateUser, async (req, res) => {
 
const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }
 

db.query('SELECT * FROM weekly_task WHERE user_id = ?', [user_id], (err, results) => {
  if (err) {
    console.error('Error fetching tasks from MySQL:', err);
    return res.status(500).json({ message: 'Failed to fetch tasks from MySQL' });
  }
  res.json(results);
});



});


// Save weekly tasks:

// app.post('/api/save-tasks', async (req, res) => {
//   const { tasks } = req.body;

//   // Prepare data for the SQL query
//   try {
//     const promises = tasks.map((task) => {
//       const time = task.time;
//       const monday = task.monday.join(', ');
//       const tuesday = task.tuesday.join(', ');
//       const wednesday = task.wednesday.join(', ');
//       const thursday = task.thursday.join(', ');
//       const friday = task.friday.join(', ');
//       const saturday = task.saturday.join(', ');

//       const query = `
//         INSERT INTO weekly_task (time, monday, tuesday, wednesday, thursday, friday, saturday)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//       `;

//       // Return a promise for each query
//       return new Promise((resolve, reject) => {
//         db.query(query, [time, monday, tuesday, wednesday, thursday, friday, saturday], (err, result) => {
//           if (err) reject(err);
//           else resolve(result);
//         });
//       });
//     });

//     // Wait for all database queries to finish
//     await Promise.all(promises);

//     res.status(200).json({ message: 'Tasks saved successfully!' });
//   } catch (error) {
//     console.error('Error saving task data:', error);
//     res.status(500).json({ message: 'Error saving task data', error });
//   }
// });



// 🟢 SERVER START
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
