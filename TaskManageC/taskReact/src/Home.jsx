import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoIosLogOut, IoMdClose } from "react-icons/io";
import { IoAddSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const Home = () => {
  const [taskData, setTaskData] = useState([]);
  const [isError, setIsError] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postDate, setPostDate] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const [editTaskId, setEditTaskId] = useState(null); // ID of the task being edited

  const navigate = useNavigate();

  // Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  // Fetch Tasks from Backend
  const getData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://taskmanegement-backend.onrender.com', {
        headers: {
          Authorization: token,
        },
      });
      setTaskData(res.data);
    } catch (error) {
      setIsError(error.message);
      navigate('/login');
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Add New Task
  const postTasks = async (e) => {
    

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsError('Token not found. Please log in again.');
        return;
      }

      const res = await axios.post(
        'https://taskmanegement-backend.onrender.com',
        { 
          title: postTitle,
          description: postDescription,
          completed: isComplete,
          dueDate: postDate
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // Assuming the backend returns the created task with _id
      setTaskData(prev => [...prev, res.data]);

      // Reset form fields
      setPostTitle('');
      setPostDescription('');
      setPostDate('');
      setIsComplete(false);
      setIsModal(false);
      setIsError(null); 

    } catch (error) {
      console.error('Error posting task:', error);
      
      if (error.response && error.response.status === 401) {
        setIsError('Unauthorized. Please log in again.');
      } else {
        setIsError('Failed to post the task. Please try again.');
      }
    }
  };

  // Delete Task
  const deleteTask = async(id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://taskmanegement-backend.onrender.com/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      const updatedData = taskData.filter((task) => task._id !== id);
      setTaskData(updatedData);
      
    } catch (error) {
      console.log(error);
    }
  };

  // Toggle Complete/Incomplete Status
  const handleComplete = async (status, id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://taskmanegement-backend.onrender.com/${id}`,
        { completed: status },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // Update the task data locally after a successful request
      setTaskData((prevTaskData) =>
        prevTaskData.map((task) =>
          task._id === id ? { ...task, completed: status } : task
        )
      );
    } catch (error) {
      console.log('Error updating task:', error);
    }
  };

  // Handle Edit Button Click
  const handleEdit = (task) => {
    setEditTaskId(task._id);
    setPostTitle(task.title);
    setPostDescription(task.description);
    setPostDate(task.dueDate.split("T")[0]); // Format the date to YYYY-MM-DD
    setIsComplete(task.completed);
    setUpdateModal(true);
  };

  // Update Task
  const updateTask = async () => {
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://taskmanegement-backend.onrender.com/${editTaskId}`,
        { 
          title: postTitle, 
          description: postDescription, 
          dueDate: postDate,
          completed: isComplete 
        },
        { 
          headers: { Authorization: token } 
        }
      );

      
      setTaskData((prevTaskData) =>
        prevTaskData.map((task) =>
          task._id === editTaskId
            ? { ...task, title: postTitle, description: postDescription, dueDate: postDate, completed: isComplete }
            : task
        )
      );

      
      setEditTaskId(null);
      setPostTitle('');
      setPostDescription('');
      setPostDate('');
      setIsComplete(false);
      setUpdateModal(false);
    } catch (error) {
      console.log('Error updating task:', error);
      setIsError('Failed to update the task. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#fc0599] via-[#03d5e0] to-[#a307e6] min-h-screen pb-3">
      <div className="container px-5 mx-auto space-y-9">
        <h2 className="pt-5 text-3xl font-bold text-center text-white uppercase">Task Board</h2>
        
        {/* Logout Button */}
        <p
          className="absolute flex items-center justify-center w-12 p-2 space-x-3 font-medium text-white uppercase transition-all duration-200 bg-red-500 rounded-lg shadow-md cursor-pointer shadow-black hover:shadow-none hover:text-black md:w-32 -top-3 right-4"
          onClick={logout}
        >
          <span className="hidden md:block">logout</span>
          <span className="text-xl font-bold"><IoIosLogOut /></span>
        </p>
        
        {/* Add Task Button */}
        <button
          onClick={() => setIsModal(true)}
          className="absolute p-1 text-3xl text-white transition-all duration-200 rounded-full shadow-md shadow-black hover:shadow-none hover:text-black bg-lime-500 -top-4"
        >
          <IoAddSharp />
        </button>
        
        {/* Error Message */}
        {isError && <h1 className="text-center text-red-500">{isError}</h1>}

        {/* Task Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {taskData.map((task) => (
            <div key={task._id} className="flex flex-col items-center justify-between p-4 space-y-3 shadow-md bg-neutral-200 rounded-2xl">
              <p className='p-3 font-mono text-xl font-bold text-center uppercase rounded-r-full rounded-bl-full shadow-inner shadow-black'>
                {task.title}
              </p>
              
              <p className='p-1 text-gray-600 text-balance '>
                {task.description}
              </p>
              
              <div className='flex space-x-10'>
                {/* Created Date */}
                <p className='px-3 py-1 text-white rounded-full bg-lime-500'>
                  {(() => {
                    const date = new Date(task.createdAt);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    return `${year}.${month}.${day}`;
                  })()}
                </p>

                {/* Due Date */}
                <p className='px-3 py-1 text-white bg-red-500 rounded-full'>
                  {(() => {
                    const date = new Date(task.dueDate);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    return `${year}.${month}.${day}`;
                  })()}
                </p>
              </div>
              
              <div className='flex items-center pt-1 space-x-16'>
                {/* Complete/Incomplete Button */}
                {task.completed ? (
                  <button
                    onClick={() => handleComplete(false, task._id)} // Mark as Incomplete
                    className="px-3 py-1 -ml-6 text-sm text-white uppercase bg-green-700 rounded-full shadow-md shadow-black hover:shadow-none"
                  >
                    Complete
                  </button>
                ) : (
                  <button
                    onClick={() => handleComplete(true, task._id)} // Mark as Complete
                    className="px-3 py-1 -ml-6 text-sm text-white uppercase bg-red-700 rounded-full shadow-md shadow-black hover:shadow-none"
                  >
                    Incomplete
                  </button>
                )}

                {/* Edit and Delete Icons */}
                <div className='flex space-x-2 text-xl'>
                  <FaRegEdit 
                    onClick={() => handleEdit(task)} 
                    className='cursor-pointer text-violet-500 hover:text-violet-800' 
                  />
                  <RiDeleteBin6Line 
                    onClick={() => deleteTask(task._id)}  
                    className='text-red-500 cursor-pointer hover:text-red-800' 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      {isModal && (
        <div className="fixed top-0 flex items-center justify-center w-full h-screen bg-black/25">
          <div className="relative bg-white rounded-lg lg:w-1/3">
            <button
              className="absolute p-1 text-2xl text-white bg-black rounded-full -right-5 -top-5"
              onClick={() => setIsModal(false)}
            >
              <IoMdClose />
            </button>

            <form className="flex flex-col justify-center space-y-4 p-9" onSubmit={postTasks}>
              <input
                className="p-2 rounded-lg outline-none ring-1 ring-black/15"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                type="text"
                name="title"
                placeholder="Task Title"
                required
              />
              <textarea
                value={postDescription}
                onChange={(e) => setPostDescription(e.target.value)}
                name="description"
                placeholder="Task Description"
                rows={4}
                className="p-2 rounded-lg outline-none resize-none ring-1 ring-black/15"
              ></textarea>
              <input
                className="p-2 rounded-lg outline-none ring-1 ring-black/15"
                value={postDate}
                onChange={(e) => setPostDate(e.target.value)}
                type="date"
                name="dueDate"
                required
              />
              <input
                className="self-center w-full p-2 font-medium text-white uppercase transition-all duration-200 bg-green-500 rounded-lg shadow-md cursor-pointer md:w-32 shadow-black hover:shadow-none hover:text-black"
                type="submit"
                value="ADD TASK"
              />
            </form>
          </div>
        </div>
      )}

      {/* Update/Edit Task Modal */}
      {updateModal && (
        <div className="fixed top-0 flex items-center justify-center w-full h-screen bg-black/25">
          <div className="relative bg-white rounded-lg lg:w-1/3">
            <button
              className="absolute p-1 text-2xl text-white bg-black rounded-full -right-5 -top-5"
              onClick={() => {
                setUpdateModal(false);
                setEditTaskId(null);
                setPostTitle('');
                setPostDescription('');
                setPostDate('');
                setIsComplete(false);
              }}
            >
              <IoMdClose />
            </button>

            <form className="flex flex-col justify-center space-y-4 p-9" onSubmit={updateTask}>
              <input
                className="p-2 rounded-lg outline-none ring-1 ring-black/15"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                type="text"
                name="title"
                placeholder="Task Title"
                required
              />
              <textarea
                value={postDescription}
                onChange={(e) => setPostDescription(e.target.value)}
                name="description"
                placeholder="Task Description"
                rows={4}
                className="p-2 rounded-lg outline-none resize-none ring-1 ring-black/15"
              ></textarea>
              <input
                className="p-2 rounded-lg outline-none ring-1 ring-black/15"
                value={postDate}
                onChange={(e) => setPostDate(e.target.value)}
                type="date"
                name="dueDate"
                required
              />
              {/* Optionally, include a checkbox to update completion status */}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isComplete}
                  onChange={(e) => setIsComplete(e.target.checked)}
                />
                <span>Completed</span>
              </label>
              <input
                className="self-center w-full p-2 font-medium text-white uppercase transition-all duration-200 bg-green-500 rounded-lg shadow-md cursor-pointer md:w-32 shadow-black hover:shadow-none hover:text-black"
                type="submit"
                value="UPDATE"
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
