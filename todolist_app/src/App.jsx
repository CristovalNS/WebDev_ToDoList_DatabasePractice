import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogIn from './components/auth/login'; 
import Register from './components/auth/register'; 
import { Header } from './components/header';
import { Tasks } from './components/tasks'; 
import { auth } from './backend/firebase_config/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showRegister, setShowRegister] = useState(false); 
  const [userId, setUserId] = useState(null);

  const handleLoginSuccess = (user) => {
    setUserEmail(user.email);
    setUserId(user.uid); 
    setIsAuthenticated(true);
    fetchTasks(user.uid);
  };

// CREATE
const handleAddTask = (newTitle) => {
  if (!userId) return;
  axios.post('http://localhost:8000/tasks/', { title: newTitle, isCompleted: false, user_id: userId })
    .then(response => setTasks(prevTasks => [...prevTasks, response.data]))
    .catch(error => console.error('Error adding task:', error));
};

// READ
const fetchTasks = (userId) => {
  axios.get(`http://localhost:8000/tasks/${userId}`)
    .then(response => setTasks(response.data))
    .catch(error => console.error('Error fetching tasks:', error));
};

// UPDATE
const onUpdate = (taskId, updatedFields) => {
  if (!userId) return;
  axios.put(`http://localhost:8000/tasks/${taskId}`, { title: tasks.find(task => task.id === taskId).title, ...updatedFields, user_id: userId })
    .then(() => setTasks(tasks.map(task => task.id === taskId ? { ...task, ...updatedFields } : task)))
    .catch(error => console.error('Error updating task:', error));
};

// DELETE
const onDelete = (taskId) => {
  if (!userId) return;
  axios.delete(`http://localhost:8000/tasks/${taskId}/${userId}`)
    .then(() => setTasks(tasks.filter(task => task.id !== taskId)))
    .catch(error => console.error('Error deleting task:', error));
};

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      handleLoginSuccess(user);
    } else {
      setUserEmail('');
      setUserId(null);
      setIsAuthenticated(false);
      setTasks([]); 
    }
  });

  return () => {
    unsubscribe();
  };
}, []);

  return (
    <>
      {!isAuthenticated ? (
        <>
          {showRegister ? (
            <Register />
          ) : (
            <LogIn onLoginSuccess={handleLoginSuccess} />
          )}
          <button onClick={() => setShowRegister(!showRegister)}>
            {showRegister ? 'Have an account? Log In' : 'Create an account'}
          </button>
        </>
      ) : (
        <>
          <Header handleAddTask={handleAddTask} />
          <Tasks tasks={tasks} setTasks={setTasks} onDelete={onDelete} onUpdate={onUpdate} onComplete={(taskId) => onUpdate(taskId, {isCompleted: true})} />
          <div>
            <p>Logged in as {userEmail}</p>
            <button onClick={() => auth.signOut()}>Log Out</button>
          </div>
        </>
      )}
    </>
  );
}

export default App;
