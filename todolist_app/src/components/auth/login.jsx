import React, { useState } from 'react';
import { auth } from '../../../firebase_config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence
} from 'firebase/auth'; 
import styles from './auth.module.css';

const LogIn = ({ onLoginSuccess }) => {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false); // "Remember Me" feature

    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    // Handle login with email and password
    const logIn = (e) => {
        e.preventDefault();
        const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
        setPersistence(auth, persistenceType) 
            .then(() => {
                return signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            })
            .then((userCredential) => {
                console.log(userCredential);
                window.alert("Login successful!");
                if (typeof onLoginSuccess === 'function') {
                    onLoginSuccess();
                }
            })
            .catch((error) => {
                console.error(error);
                window.alert("Login failed: " + error.message);
            });
    };

    // Handle Google login
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        setPersistence(auth, browserLocalPersistence) // Assume "Remember Me" for social logins
            .then(() => {
                return signInWithRedirect(auth, provider);
            })
            .then((result) => {
                console.log(result);
                window.alert("Google login successful!");
                if (typeof onLoginSuccess === 'function') {
                    onLoginSuccess();
                }
            }).catch((error) => {
                console.error(error);
                window.alert("Google login failed: " + error.message); 
            });
    };

    // Handle user registration
    const register = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, registerEmail, registerPassword) 
        .then((userCredential) => {
            console.log(userCredential);
            window.alert("Registration successful!"); 
            if (typeof onLoginSuccess === 'function') {
                onLoginSuccess();
            }
        }).catch((error) => {
            console.error(error);
            window.alert("Registration failed: " + error.message); 
        })
    }

    return (
        <div className={styles['login-container']}>
            <form onSubmit={logIn}>
                <h1>Log In to your Account</h1>
                <input
                    type="email"
                    placeholder='Enter your email'
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className={styles['input']}
                />
                <input
                    type="password"
                    placeholder='Enter your password'
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={styles['input']}
                />
                <label>
                    <div className={styles['checkbox-container']}>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className={styles['checkbox']}
                        />
                        <span className={styles['checkbox-label']}>Remember Me</span>
                    </div>

                </label>
                <button type="submit" className={styles['button']}> 
                    Log In
                </button>

                <button type="button" onClick={signInWithGoogle} className={styles['button']}> 
                    Log In with Google
                </button>
            </form>

            <form onSubmit={register} className={styles.form}>
                <h1> Create an Account </h1>
                <input 
                    type="email" 
                    placeholder='Enter your email'
                    value={registerEmail} 
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className={styles.input}
                />
                <input 
                    type="password" 
                    placeholder='Enter your password'
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className={styles.input}
                />
                <button type="submit" className={styles.button}> Register </button>
            </form>
        </div>
    );
};

export default LogIn;
