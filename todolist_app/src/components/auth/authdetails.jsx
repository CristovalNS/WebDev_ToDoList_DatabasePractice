import React, {useState, useEffect} from 'react'
import {auth} from '../../backend/firebase_config/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

const AuthDetails = () => {
    const [authUser, setAuthUser] = useState(null)

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        })

        return () => {
            listen();
        }

    }, []);

    const userlogOut = () => {
        signOut(auth).then(() => {
            console.log('Log out successful')
        }).catch(error => console.log(error))
    }
    
    return (
        <div> 
            {authUser ? <>
                <p> {`Logged In as ${authUser.email}`} </p> 
                <button onClick={userlogOut}> Log Out </button> 
            </> : <p> Logged Out </p>} 
        </div>
    )
}

export default AuthDetails;