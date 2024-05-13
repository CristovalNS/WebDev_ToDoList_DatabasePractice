import React, { useEffect, useState } from 'react';
import { auth } from '../../../../../backend/firebase_config/firebase.js';
import { setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import Cookies from 'js-cookie';
import styles from '../user_profile/userprofile.module.css';

function UserProfile({ user, onClose }) {
  if (!user) return null;

  const [persistentLogin, setPersistentLogin] = useState(false);

  useEffect(() => {
    // Retrieve persistence setting from cookies
    const savedPreference = Cookies.get('persistentLogin') === 'true';
    setPersistentLogin(savedPreference);
  }, []);

  const handleToggleChange = async (e) => {
    const newPersistentLogin = e.target.checked;
    setPersistentLogin(newPersistentLogin);

    // Store preference in cookies
    Cookies.set('persistentLogin', newPersistentLogin, { expires: 7 }); // Expires in 7 days

    // Update Firebase persistence setting based on the toggle
    const persistenceType = newPersistentLogin ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistenceType);
  };

  const formattedDate = new Date(user.creationTime).toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h1>User Profile</h1>
        <p>Email: {user.email}</p>
        <p>UID: {user.uid}</p>
        <p>Date Created: {formattedDate}</p>
        <label>
          Persistent login:
          <div key={persistentLogin ? 'logged-in' : 'logged-out'}>
            <input
              type="checkbox"
              checked={persistentLogin}
              onChange={handleToggleChange}
            />
            </div>
        </label>
      </div>
    </div>
  );
}

export default UserProfile;
