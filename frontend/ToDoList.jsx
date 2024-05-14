import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import ProfileIcon from "./assets/kuromi.jpg";
import toast from "react-hot-toast";
import { auth } from "./firebase"; // Import Firebase authentication

// Header function
function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to the Profile.jsx page
  };

  return (
    <div className="header">
      <button className="profile-button" onClick={handleProfileClick}>
        <div className="user-profile">
          <div className="user-details">
            <span className="email">{user?.email}</span>
          </div>
          {!user?.photoURL ? (
            <img src={ProfileIcon} className="profile-img" alt="Profile" />
          ) : (
            <img src={user?.photoURL} className="profile-img" alt="Profile" />
          )}
        </div>
      </button>

      <div className="user-details">
        <p>Name: Vania Agnes Djunaedy ⋆˚🐾˖°</p>
        <p>NIM: 2602158531 ⋆˙⟡♡</p>
        <p>Class: L4BC ⋆૮₍´˶• . • ⑅ ₎ა</p>
      </div>
    </div>
  );
}

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/");
  };

  async function fetchTodos() {
    if (!user) return;
    try {
      const response = await axios.get(`http://localhost:8000/tasks/`);
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  }

  // Add a new task
  async function addTask() {
    if (!newTask.trim()) {
      toast.error("Please input the new task title");
      return;
    }
    try {
      await axios.post('http://localhost:8000/tasks/', {
        title: newTask,
        completed: false,
      });
      setNewTask("");
      fetchTodos(); // Refresh the list
    } catch (error) {
      console.error('Failed to add task', error);
    }
  }

  // Delete a task
  async function deleteTask(id) {
    try {
      await axios.delete(`http://localhost:8000/tasks/${id}`);
      fetchTodos(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  }

  // Update a task
  async function updateTodo(task) {
    try {
      await axios.put(`http://localhost:8000/tasks/${task.id}/`, {
        title: task.title,
        completed: task.completed
      });
      fetchTodos(); // Refresh the list
    } catch (error) {
      console.error('Failed to update task', error);
    }
  }

  // Toggle task completion status
  async function toggleTaskCompletion(task) {
    try {
      await axios.put(`http://localhost:8000/tasks/${task.id}/toggle/`);
      fetchTodos(); // Refresh the list
    } catch (error) {
      console.error('Failed to toggle task completion', error);
    }
  }

  // Edit a task title
  async function editTask(id, newText) {
    try {
      await axios.put(`http://localhost:8000/tasks/${id}/`, {
        title: newText,
        completed: false
      });
      fetchTodos(); // Refresh the list
    } catch (error) {
      console.error('Failed to edit task', error);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, [user]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function handleTaskStatus(task) {
    toggleTaskCompletion(task);
  }

  function handleDeleteTask(id) {
    deleteTask(id);
  }

  function handleMoveTaskUp(index) {
    if (index > 0) {
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        const temp = updatedTasks[index];
        updatedTasks[index] = updatedTasks[index - 1];
        updatedTasks[index - 1] = temp;
        return updatedTasks;
      });
    }
  }

  function handleMoveTaskDown(index) {
    if (index < tasks.length - 1) {
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        const temp = updatedTasks[index];
        updatedTasks[index] = updatedTasks[index + 1];
        updatedTasks[index + 1] = temp;
        return updatedTasks;
      });
    }
  }

  function applyFilter(event) {
    setFilter(event.target.value);
  }

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(filter.toLowerCase())
  );

  const uncompletedTasks = filteredTasks.filter((task) => !task.completed);
  const completedTasks = filteredTasks.filter((task) => task.completed);

  return (
    <div>
      <Header />
      <button className="log-out" onClick={goToLogin}>Log Out</button>
      <div className="to-do-list">
        <h1>To-Do List</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Search Tasks..."
            value={filter}
            onChange={applyFilter}
          />
          <input
            type="text"
            placeholder="Enter a Task..."
            value={newTask}
            onChange={handleInputChange}
          />
          <button className="add-button" onClick={addTask}>
            Add
          </button>
        </div>
        <div>
          <button
            className="uncompleted-button"
            onClick={() => setShowCompleted(false)}
          >
            Uncompleted
          </button>
          <button
            className="completed-button"
            onClick={() => setShowCompleted(true)}
          >
            Completed
          </button>
        </div>
        <ol>
          {showCompleted
            ? completedTasks.map((task) => (
                <li key={task.id} className="completed">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleTaskStatus(task)}
                  />
                  <span className="text">{task.title}</span>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    🗑️
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => {
                      const newText = prompt("Enter new task title:", task.title);
                      if (newText !== null) {
                        editTask(task.id, newText);
                      }
                    }}
                  >
                    ✏️
                  </button>
                </li>
              ))
            : uncompletedTasks.map((task, index) => (
                <li key={task.id}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleTaskStatus(task)}
                  />
                  <span className="text">{task.title}</span>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    🗑️
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => {
                      const newText = prompt("Enter new task title:", task.title);
                      if (newText !== null) {
                        editTask(task.id, newText);
                      }
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className="move-button"
                    onClick={() => handleMoveTaskUp(index)}
                  >
                    ⬆
                  </button>
                  <button
                    className="move-button"
                    onClick={() => handleMoveTaskDown(index)}
                  >
                    ⬇
                  </button>
                </li>
              ))}
        </ol>
      </div>
    </div>
  );
}

export default ToDoList;
