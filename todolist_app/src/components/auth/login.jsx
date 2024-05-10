import React, { useState } from 'react';
import { auth } from '../../backend/firebase_config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth'; 
import styles from './auth.module.css';

const LogIn = ({ onLoginSuccess }) => {
    
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    const logIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, loginEmail, loginPassword) 
            .then((userCredential) => {
                console.log(userCredential);
                if (typeof onLoginSuccess === 'function') {
                    onLoginSuccess();
                } else {
                    console.warn('onLoginSuccess is not defined.');
                }
                window.alert("Login successful!"); 
            }).catch((error) => {
                console.error(error);
                window.alert("Login failed: " + error.message); 
            });
    };

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider)
            .then((result) => {
                console.log(result);
                if (typeof onLoginSuccess === 'function') {
                    onLoginSuccess();
                } else {
                    console.warn('onLoginSuccess is not defined.');
                } 
                window.alert("Google login successful!"); 
            }).catch((error) => {
                console.error(error);
                window.alert("Google login failed: " + error.message); 
            });
    };

    const register = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, registerEmail, registerPassword) 
        .then((userCredential) => {
            console.log(userCredential);
            if (typeof onLoginSuccess === 'function') {
                onLoginSuccess();
            } else {
                console.warn('onLoginSuccess is not defined.');
            } 
            window.alert("Registration successful!"); 
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
