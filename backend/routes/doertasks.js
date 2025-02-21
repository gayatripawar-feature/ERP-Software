
const express = require("express");
const router = express.Router();
const db = require("../db"); 

// Route to save weekly tasks
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


// ✅ Route to Get Weekly Tasks
// router.get("/getWeeklyTasks", async (req, res) => {
//     try {
//         const query = `
//             SELECT 
//                 time_slot,
//                 MAX(CASE WHEN assigned_days LIKE '%Mon%' THEN task_details END) AS Monday,
//                 MAX(CASE WHEN assigned_days LIKE '%Tue%' THEN task_details END) AS Tuesday,
//                 MAX(CASE WHEN assigned_days LIKE '%Wed%' THEN task_details END) AS Wednesday,
//                 MAX(CASE WHEN assigned_days LIKE '%Thu%' THEN task_details END) AS Thursday,
//                 MAX(CASE WHEN assigned_days LIKE '%Fri%' THEN task_details END) AS Friday,
//                 MAX(CASE WHEN assigned_days LIKE '%Sat%' THEN task_details END) AS Saturday
//             FROM tasks
//             WHERE start_date <= CURDATE() 
//             AND (end_date IS NULL OR end_date >= CURDATE())
//             GROUP BY time_slot;
//         `;

//         const [rows] = await db.execute(query);

//         res.json(rows);
//     } catch (error) {
//         console.error("❌ Error fetching weekly tasks:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// router.get("/getWeeklyTasks", async (req, res) => {
//     try {
//         const query = `
//             SELECT time_slot,
//                    MAX(CASE WHEN assigned_days LIKE '%Mon%' THEN task_details END) AS Monday,
//                    MAX(CASE WHEN assigned_days LIKE '%Tue%' THEN task_details END) AS Tuesday,
//                    MAX(CASE WHEN assigned_days LIKE '%Wed%' THEN task_details END) AS Wednesday,
//                    MAX(CASE WHEN assigned_days LIKE '%Thu%' THEN task_details END) AS Thursday,
//                    MAX(CASE WHEN assigned_days LIKE '%Fri%' THEN task_details END) AS Friday,
//                    MAX(CASE WHEN assigned_days LIKE '%Sat%' THEN task_details END) AS Saturday
//             FROM tasks
//             WHERE start_date <= CURDATE()
//             AND (end_date IS NULL OR end_date >= CURDATE())
//             GROUP BY time_slot;
//         `;

//         const [rows] = await db.execute(query);

//         // Formatting the output
//         const formattedTasks = rows.map(row => ({
//             time_slot: row.time_slot,
//             Monday: row.Monday || "-",
//             Tuesday: row.Tuesday || "-",
//             Wednesday: row.Wednesday || "-",
//             Thursday: row.Thursday || "-",
//             Friday: row.Friday || "-",
//             Saturday: row.Saturday || "-",
//         }));

//         res.json(formattedTasks);
//     } catch (error) {
//         console.error("Error fetching weekly tasks:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });





// // Define the /getWeeklyTasks API route
// router.get("/getWeeklyTasks", async (req, res) => {
//     try {
//         const { startDate, endDate } = req.query;  
//         const query = `
//             SELECT time_slot, assigned_days, task_details 
//             FROM tasks 
//             WHERE start_date BETWEEN ? AND ?
//             ORDER BY time_slot ASC
//         `;
//         const [tasks] = await db.query(query, [startDate, endDate]);

//         // Transform data into Weekly Format
//         let weeklyData = {};
//         tasks.forEach(({ time_slot, assigned_days, task_details }) => {
//             if (!weeklyData[time_slot]) {
//                 weeklyData[time_slot] = { Mon: "-", Tue: "-", Wed: "-", Thu: "-", Fri: "-", Sat: "-" };
//             }
//             assigned_days.split(",").forEach(day => {
//                 weeklyData[time_slot][day] = task_details;
//             });
//         });

//         res.json(weeklyData);
//     } catch (error) {
//         console.error("Error fetching weekly tasks:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

module.exports = router;



