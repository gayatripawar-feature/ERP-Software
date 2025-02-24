
// =====working ===

// const express = require('express');
// const mysql = require('mysql2/promise'); // ✅ Use promise-based MySQL
// const bodyParser = require('body-parser');

// const router = express.Router();

// router.use(bodyParser.json());

// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'employee_system',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// // ✅ Test route
// router.get('/test', (req, res) => {
//   res.send('Tasks route is working!');
// });

// // ✅ Save tasks endpoint
// router.post('/save-tasks', async (req, res) => {
//   let { tasks } = req.body;

//   console.log("✅ Received tasks in correct format:", JSON.stringify(tasks, null, 2));

//   if (!tasks || !Array.isArray(tasks)) {
//     return res.status(400).json({ message: 'Invalid tasks data', receivedData: tasks });
//   }

//   try {
//     const connection = await db.getConnection();
//     await Promise.all(
//       tasks.map(async (task) => {
//         const query = `
//           INSERT INTO weekly_task (time, monday, tuesday, wednesday, thursday, friday, saturday)
//           VALUES (?, ?, ?, ?, ?, ?, ?)
//         `;

//         const values = [
//           task.time || '',
//           task.monday || '',
//           task.tuesday || '',
//           task.wednesday || '',
//           task.thursday || '',
//           task.friday || '',
//           task.saturday || '',
//         ];

//         await connection.query(query, values);
//       })
//     );
//     connection.release();

//     res.status(200).json({ message: 'Tasks saved successfully!' });
//   } catch (err) {
//     console.error(' Database Error:', err);
//     res.status(500).json({ message: 'Database error', error: err.message });
//   }
// });

// // ✅ Export router
// module.exports = router;












const express = require('express');
const db = require('../db'); 
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();
router.use(bodyParser.json());

// ✅ Test route
router.get('/test', (req, res) => {
  res.send('Tasks route is working!');
});

router.post('/save-tasks', (req, res) => {
  const { tasks } = req.body;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({ error: 'Invalid task data' });
  }

  const insertQuery = `
    INSERT INTO weekly_task (time, monday, tuesday, wednesday, thursday, friday, saturday)
    VALUES ? 
    ON DUPLICATE KEY UPDATE
    monday=VALUES(monday),
    tuesday=VALUES(tuesday),
    wednesday=VALUES(wednesday),
    thursday=VALUES(thursday),
    friday=VALUES(friday),
    saturday=VALUES(saturday);
  `;

  const values = tasks.map(task => [
    task.time,
    task.monday,
    task.tuesday,
    task.wednesday,
    task.thursday,
    task.friday,
    task.saturday
  ]);

  db.query(insertQuery, [values], (err, result) => {
    if (err) {
      console.error('Error saving tasks:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Tasks saved successfully' });
  });
});





// router.get('/api/getWeeklyTasks/:user_id', (req, res) => {
  router.get('/getWeeklyTasks/:user_id', (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  
  db.query('SELECT * FROM weekly_task WHERE user_id = ?', [user_id], (err, results) => {
    if (err) {
    
      console.error('Error fetching tasks from MySQL:', err);
      return res.status(500).json({ message: 'Failed to fetch tasks from MySQL', error: err.message });
    }

    res.json(results);
  });
});



module.exports = router;




