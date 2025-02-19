




import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const TaskUploadForm = () => {
    const [date, setDate] = useState("");
    const [tasks, setTasks] = useState([{ time: "", taskList: [""] }]);
    const [taskDetails, setTaskDetails] = useState({
        description: "",
        category: "",
        priority: "Medium",
        dueDate: "",
        repeat: "Daily",
    });

    const handleTaskDetailsChange = (field, value) => {
        setTaskDetails({ ...taskDetails, [field]: value });
    };

    const handleTaskChange = (index, taskIndex, value) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].taskList[taskIndex] = value;
        setTasks(updatedTasks);
    };

    const handleTimeChange = (index, value) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].time = value;
        setTasks(updatedTasks);
    };

    const addTaskToTimeSlot = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].taskList.push("");
        setTasks(updatedTasks);
    };

    const addNewTimeSlot = () => {
        setTasks([...tasks, { time: "", taskList: [""] }]);
    };

    const removeTask = (index, taskIndex) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].taskList.splice(taskIndex, 1);
        if (updatedTasks[index].taskList.length === 0) {
            updatedTasks.splice(index, 1);
        }
        setTasks(updatedTasks);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Tasks Submitted:", { date, taskDetails, tasks });
        alert("Tasks successfully saved!");
    };

    return (
        <div className="container mt-4 p-4 shadow-lg rounded bg-white">
            <h2 className="text-center text-primary mb-4">Upload Your Schedule</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label fw-bold text-black">Select Date:</label>
                    <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>

                <div className="border p-3 mb-4 bg-light rounded">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="fw-bold text-black">Description:</label>
                            <input type="text" className="form-control" value={taskDetails.description} onChange={(e) => handleTaskDetailsChange("description", e.target.value)} required />
                        </div>
                        <div className="col-md-6">
                            <label className="fw-bold text-black">Category:</label>
                            <input type="text" className="form-control" value={taskDetails.category} onChange={(e) => handleTaskDetailsChange("category", e.target.value)} required />
                        </div>
                        <div className="col-md-6">
                            <label className="fw-bold text-black">Priority:</label>
                            <select className="form-control" value={taskDetails.priority} onChange={(e) => handleTaskDetailsChange("priority", e.target.value)}>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="fw-bold text-black">Due Date:</label>
                            <input type="date" className="form-control" value={taskDetails.dueDate} onChange={(e) => handleTaskDetailsChange("dueDate", e.target.value)} required />
                        </div>
                        <div className="col-md-6">
                            <label className="fw-bold text-black">Repeat:</label>
                            <select className="form-control" value={taskDetails.repeat} onChange={(e) => handleTaskDetailsChange("repeat", e.target.value)}>
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                                <option value="Periodically">Periodically</option>
                                <option value="Custom">Custom</option>
                            </select>
                        </div>
                    </div>
                </div>

                {tasks.map((task, index) => (
                    <div key={index} className="border p-3 mb-3 bg-light rounded">
                        <div className="row g-3">
                            <div className="col-md-5">
                                <label className="fw-bold text-black">Time Slot:</label>
                                <input type="time" className="form-control" value={task.time} onChange={(e) => handleTimeChange(index, e.target.value)} required />
                            </div>
                        </div>

                        {task.taskList.map((taskName, taskIndex) => (
                            <div key={taskIndex} className="row g-3 mt-2 align-items-center">
                                <div className="col-md-5">
                                    <label className="fw-bold text-black">Task:</label>
                                    <input type="text" className="form-control" value={taskName} onChange={(e) => handleTaskChange(index, taskIndex, e.target.value)} required />
                                </div>
                                <div className="col-md-2">
                                    <button type="button" className="btn btn-danger w-100" onClick={() => removeTask(index, taskIndex)}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="mt-2">
                            <button type="button" className="btn btn-outline-primary" onClick={() => addTaskToTimeSlot(index)}>
                                + Add Another Task for this Time
                            </button>
                        </div>
                    </div>
                ))}

                <button type="button" className="btn btn-outline-success me-3" onClick={addNewTimeSlot}>
                    + Add New Time Slot
                </button>
                <button type="submit" className="btn btn-primary">Save Schedule</button>
            </form>
        </div>
    );
};

export default TaskUploadForm;
