
const express = require("express");
const router = express.Router();
const db = require("../db"); 
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const mysql = require('mysql2');
router.use(bodyParser.json());
app.use(cors());
router.post("/saveWeeklyTasks", async (req, res) => {
    try {
        const { date, taskDetails, tasks, assignedDays } = req.body;

        console.log("Received Task Data:", req.body);

        if (!date || !taskDetails || !tasks || tasks.length === 0) {
            return res.status(400).json({ error: "Invalid task data received" });
        }

        let values = [];
        for (const task of tasks) {
            const { time, taskList } = task;
            if (!Array.isArray(taskList) || taskList.length === 0) continue;

            for (const taskEntry of taskList) {
                if (typeof taskEntry !== "string") continue;
                values.push([
                    date,  
                    date,  
                    taskDetails.repeat, 
                    assignedDays,  
                    time,  
                    taskEntry,  
                    taskDetails.category,  
                    taskDetails.priority 
                ]);
            }
        }

        if (values.length === 0) {
            return res.status(400).json({ error: "No valid tasks to insert" });
        }

        const query = `
            INSERT INTO tasks (start_date, end_date, repeat_type, assigned_days, time_slot, task_details, category, priority)
            VALUES ?
        `;

        try {
            const [result] = await db.promise().query(query, [values]);
            res.json({ message: `${result.affectedRows} tasks successfully saved` });
        } catch (error) {
            console.error("SQL Error:", error.message);
            res.status(500).json({ error: "Database error", details: error.message });
        }

    } catch (error) {
        console.error("Error saving tasks:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});







  
// router.get('/api/getWeeklyTasks/:user_id', (req, res) => {
//     const { user_id } = req.params;

//     if (!user_id) {
//       return res.status(400).json({ message: 'User ID is required' });
//     }
//     console.log('User ID:', user_id);

//     db.query(
//       'SELECT time_slot, ' +
//       'MAX(CASE WHEN FIND_IN_SET("Mon", assigned_days) THEN task_details ELSE "-" END) AS Monday, ' +
//       'MAX(CASE WHEN FIND_IN_SET("Tue", assigned_days) THEN task_details ELSE "-" END) AS Tuesday, ' +
//       'MAX(CASE WHEN FIND_IN_SET("Wed", assigned_days) THEN task_details ELSE "-" END) AS Wednesday, ' +
//       'MAX(CASE WHEN FIND_IN_SET("Thu", assigned_days) THEN task_details ELSE "-" END) AS Thursday, ' +
//       'MAX(CASE WHEN FIND_IN_SET("Fri", assigned_days) THEN task_details ELSE "-" END) AS Friday, ' +
//       'MAX(CASE WHEN FIND_IN_SET("Sat", assigned_days) THEN task_details ELSE "-" END) AS Saturday ' +
//       'FROM tasks WHERE user_id = ? GROUP BY time_slot ORDER BY time_slot;',
//       [user_id],
//       (err, results) => {
//         if (err) {
//           console.error("Error fetching tasks from MySQL:", err);
//           return res.status(500).json({ message: 'Failed to fetch tasks from MySQL' });
//         }

//         if (results.length === 0) {
//           console.log(`No tasks found for user_id: ${user_id}`);
//           return res.status(404).json({ message: 'No tasks found for this user' });
//         }

//         console.log('Tasks for user:', results); 
//         res.json(results); 
//       }
//     );
// });

router.get('/api/getWeeklyTasks/:user_id', (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    console.log('Fetching tasks for user_id:', user_id);

    db.query(
        'SELECT time_slot, ' +
        'MAX(CASE WHEN FIND_IN_SET("Mon", assigned_days) THEN task_details ELSE "-" END) AS Monday, ' +
        'MAX(CASE WHEN FIND_IN_SET("Tue", assigned_days) THEN task_details ELSE "-" END) AS Tuesday, ' +
        'MAX(CASE WHEN FIND_IN_SET("Wed", assigned_days) THEN task_details ELSE "-" END) AS Wednesday, ' +
        'MAX(CASE WHEN FIND_IN_SET("Thu", assigned_days) THEN task_details ELSE "-" END) AS Thursday, ' +
        'MAX(CASE WHEN FIND_IN_SET("Fri", assigned_days) THEN task_details ELSE "-" END) AS Friday, ' +
        'MAX(CASE WHEN FIND_IN_SET("Sat", assigned_days) THEN task_details ELSE "-" END) AS Saturday ' +
        'FROM tasks WHERE user_id = ? GROUP BY time_slot ORDER BY time_slot;',
        [user_id],
        (err, results) => {
            if (err) {
                console.error("Error fetching tasks from MySQL:", err);
                return res.status(500).json({ message: 'Failed to fetch tasks from MySQL' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'No tasks found for this user' });
            }

            res.json(results); // Return the tasks to the frontend
        }
    );
});


// router.get('/api/getWeeklyTasks/:user_id', (req, res) => {  // This is the current route

// Modify the route to use 'username' or 'email' instead of 'user_id'
// router.get('/api/getWeeklyTasks/:email', (req, res) => {
//     const { username } = req.params;  // Use username from the request params
  
//     if (!email) {
//       return res.status(400).json({ message: 'email is required' });
//     }
  
//     // Modify the SQL query to search by 'username' instead of 'user_id'
//     db.query(
//       'SELECT time_slot, ' +
//       'MAX(CASE WHEN FIND_IN_SET("Mon", assigned_days) THEN task_details ELSE "-" END) AS Monday, ' +
//       'MAX(CASE WHEN FIND_IN_SET("Tue", assigned_days) THEN task_details ELSE "-" END) AS Tuesday, ' +
//       'MAX(CASE WHEN FIND_IN_SET("Wed", assigned_days) THEN task_details ELSE "-" END) AS Wednesday, ' +
//       'MAX(CASE WHEN FIND_IN_SET("Thu", assigned_days) THEN task_details ELSE "-" END) AS Thursday, ' +
//       'MAX(CASE WHEN FIND_IN_SET("Fri", assigned_days) THEN task_details ELSE "-" END) AS Friday, ' +
//       'MAX(CASE WHEN FIND_IN_SET("Sat", assigned_days) THEN task_details ELSE "-" END) AS Saturday ' +
//       'FROM tasks WHERE username = ? GROUP BY time_slot ORDER BY time_slot;',  // Use username for query
//       [username],
//       (err, results) => {
//         if (err) {
//           console.error("Error fetching tasks from MySQL:", err);
//           return res.status(500).json({ message: 'Failed to fetch tasks from MySQL' });
//         }
  
//         if (results.length === 0) {
//           console.log(`No tasks found for username: ${username}`);
//           return res.status(404).json({ message: 'No tasks found for this user' });
//         }
  
//         console.log(results); 
//         res.json(results); 
//       }
//     );
// });


module.exports = router;



