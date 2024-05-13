import React, {useState} from 'react'
import {auth} from '../../../firebase_config/firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const register = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
        .then((useCredential) => {
            console.log(useCredential);
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <div className = 'login-container'>
            <form onSubmit={register}>
                <h1> Create an Account </h1>
                <input 
                    type="email" 
                    placeholder='Enter your email' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}>
                </input>
                <input 
                    type="password" 
                    placeholder='Enter your password' 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}>
                </input>
                <button type="submit"> Register </button>
            </form>

        </div>
    )
}

export default Register;