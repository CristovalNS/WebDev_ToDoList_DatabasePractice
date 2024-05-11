import { FaPlusCircle, FaSignOutAlt } from "react-icons/fa"; 
import todoLogo from '../../assets/todoLogo.svg';
import styles from './header.module.css';
import { useState, useEffect } from 'react';
import { auth } from "../../backend/firebase_config/firebase.js"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import UserProfile from './user_profile/user_profile';
import Cookies from 'js-cookie';

export function Header({ handleAddTask, userEmail, handleLogout }) { 
  const [title, setTitle] = useState('');
  const [authUser, setAuthUser] = useState(null)
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  function toggleUserProfile() {
    setIsProfileVisible(!isProfileVisible);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
          setAuthUser(user);
          console.log("Authenticated user:", user); // Debugging 
          setUserDetails({
            email: user.email,
            uid: user.uid,
            creationTime: user.metadata.creationTime
          });
      } else {
          setAuthUser(null);
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  function handleLogoutWrapper() {
    signOut(auth).then(() => {
      console.log("Logout successful");
      Cookies.set('persistentLogin', false, { expires: 7 });
      handleLogout(); 
    }).catch((error) => {
      console.error("Logout error", error);
    });
  }
  

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) {
      alert("Don't leave the task blank!");
      return;
    }
    handleAddTask(title.trim());
    setTitle('');
  }

  function onChangeTitle(event) {
    setTitle(event.target.value);
  } 

  return (
    <>
      <header className={styles.header}>
        <img src={todoLogo} alt="ToDo Logo" />

        <div className={styles.userInfoWrapper}> 
          <span className={styles.userInfo} onClick={toggleUserProfile}>
            Logged in as {authUser?.email}
          </span>
          <button onClick={handleLogoutWrapper} className={styles.logoutButton}>
            <FaSignOutAlt size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.addTask}>
          <input placeholder="Add a new task" type="text" onChange={onChangeTitle} value={title} />
          <button type="submit"> Add task <FaPlusCircle size={20} /></button>
        </form>

      </header>
      {isProfileVisible && <UserProfile user={userDetails} onClose={toggleUserProfile} />}
    </>
  )
}
