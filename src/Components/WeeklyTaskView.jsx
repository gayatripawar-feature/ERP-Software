






// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const WeeklyTaskView = () => {
//   const [tasks, setTasks] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         console.error("No token found, user is not logged in");
//         setError("User not authenticated.");
//         return;
//       }

//       const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
//       const userId = decodedToken.user_id;

//       const response = await axios.get(`http://localhost:5000/api/getWeeklyTasks/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setTasks(response.data);
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//       setError("Failed to fetch tasks. Please try again.");
//     }
//   };



  
//   return (
//     <div className="p-6 text-black">
//       <h1 className="text-2xl font-bold mb-4">Weekly Report</h1>
//       {error && <p className="text-red-500">{error}</p>}

//       <table className="table-auto border-collapse border border-gray-400 w-full text-black">
//         <thead>
//           <tr className="bg-gray-200 text-black">
//             <th className="border p-2">Time</th>
//             <th className="border p-2">Monday</th>
//             <th className="border p-2">Tuesday</th>
//             <th className="border p-2">Wednesday</th>
//             <th className="border p-2">Thursday</th>
//             <th className="border p-2">Friday</th>
//             <th className="border p-2">Saturday</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tasks.length > 0 ? (
//             tasks.map((task, index) => (
//               <tr key={index} className="border">
//                 <td className="border p-2">{task.time_slot}</td>
//                 <td className="border p-2">{task.Monday || '-'}</td>
//                 <td className="border p-2">{task.Tuesday || '-'}</td>
//                 <td className="border p-2">{task.Wednesday || '-'}</td>
//                 <td className="border p-2">{task.Thursday || '-'}</td>
//                 <td className="border p-2">{task.Friday || '-'}</td>
//                 <td className="border p-2">{task.Saturday || '-'}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="7" className="border p-2 text-center">No tasks available</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default WeeklyTaskView;


import React, { useEffect, useState } from "react";
import axios from "axios";

const WeeklyTaskView = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found, user is not logged in");
        setError("User not authenticated.");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
      const userId = decodedToken.user_id;

      console.log("User ID:", userId);  // Log userId to verify

      const response = await axios.get(`http://localhost:5000/api/getWeeklyTasks/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
     debugger;
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to fetch tasks. Please try again.");
    }
  };

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Weekly Report</h1>
      {error && <p className="text-red-500">{error}</p>}

      <table className="table-auto border-collapse border border-gray-400 w-full text-black">
        <thead>
          <tr className="bg-gray-200 text-black">
            <th className="border p-2">Time</th>
            <th className="border p-2">Monday</th>
            <th className="border p-2">Tuesday</th>
            <th className="border p-2">Wednesday</th>
            <th className="border p-2">Thursday</th>
            <th className="border p-2">Friday</th>
            <th className="border p-2">Saturday</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <tr key={index} className="border">
                <td className="border p-2">{task.time_slot}</td>
                <td className="border p-2">{task.Monday || '-'}</td>
                <td className="border p-2">{task.Tuesday || '-'}</td>
                <td className="border p-2">{task.Wednesday || '-'}</td>
                <td className="border p-2">{task.Thursday || '-'}</td>
                <td className="border p-2">{task.Friday || '-'}</td>
                <td className="border p-2">{task.Saturday || '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="border p-2 text-center">No tasks available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyTaskView;
