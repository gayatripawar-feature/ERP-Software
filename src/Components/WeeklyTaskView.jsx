





import React, { useEffect, useState } from 'react';  
import axios from 'axios';

const WeeklyTaskView = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const token = localStorage.getItem("authToken"); 
    console.log("Stored Token:", token);

    if (token) {
        try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            console.log("Decoded Token Data:", decoded);
            console.log("Extracted user_id:", decoded.user_id);
            // Check if user_id exists
            if (!decoded.user_id) {
                console.error("user_id is missing in the token!");
            }
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    } else {
        console.error("No token found in localStorage.");
    }
  }, []);  

 
  const fetchTasks = async () => {
    try {
        const token = localStorage.getItem("authToken");  
        console.log("Token from localStorage:", token); 
        
        if (!token) {
            console.error("No token found, user is not logged in");
            return;
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));  // Decode JWT
        console.log("Token decoded:", decodedToken);
        
        const userId = decodedToken.user_id;  
        console.log("Extracted user ID:", userId);

        if (!userId) {
            console.error("User ID is undefined in token");
            return;
        }

        
    const response = await axios.get(`http://localhost:5000/api/getWeeklyTasks/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
        console.log("Fetched Tasks:", response.data);
        setTasks(response.data);  

    } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks. Please try again.");
    }
  };

  // useEffect hook to fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);  // This effect will run once when the component mounts

  return (
    <div className='text-black'>
      <h1 className='text-black'>Weekly Report</h1>
      {error && <p className='text-red-500'>{error}</p>}  {/* Display error if any */}

      <table className='table table-bordered'>
        <thead>
          <tr className='text-black'>
            <th className='text-black'>Time</th>
            <th className='text-black'>Monday</th>
            <th className='text-black'>Tuesday</th>
            <th className='text-black'>Wednesday</th>
            <th className='text-black'>Thursday</th>
            <th className='text-black'>Friday</th>
            <th className='text-black'>Saturday</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.time}</td>
                <td>{task.monday || '-'}</td>
                <td>{task.tuesday || '-'}</td>
                <td>{task.wednesday || '-'}</td>
                <td>{task.thursday || '-'}</td>
                <td>{task.friday || '-'}</td>
                <td>{task.saturday || '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No tasks available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyTaskView;

