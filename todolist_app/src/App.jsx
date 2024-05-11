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

// UPDATE - onComplete
const onComplete = (taskId) => {
  if (!userId) return;
  const updatedTasks = tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, isCompleted: !task.isCompleted };
    }
    return task;
  });
  setTasks(updatedTasks);
  axios.put(`http://localhost:8000/tasks/${taskId}`, { ...updatedTasks.find(task => task.id === taskId), user_id: userId })
    .catch(error => console.error('Error completing task:', error));
};

// UPDATE - updating task information
const onUpdate = (taskId, updatedFields) => {
  if (!userId) return;
  const updatedTasks = tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, ...updatedFields };
    }
    return task;
  });
  setTasks(updatedTasks);
  axios.put(`http://localhost:8000/tasks/${taskId}`, { ...updatedFields, user_id: userId })
    .then(response => {
      console.log('Task updated successfully:', response.data);
    })
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
          <Tasks tasks={tasks} setTasks={setTasks} onDelete={onDelete} onUpdate={onUpdate} onComplete={(taskId) => onComplete(taskId, {isCompleted: true})} />
          {/* <div>
            <p>Logged in as {userEmail}</p>
            <button onClick={() => auth.signOut()}>Log Out</button>
          </div> */}
        </>
      )}
    </>
  );
}

export default App;
