import { onAuthStateChanged, signInWithEmailAndPassword } from '@firebase/auth';
import React from 'react'
import { useState } from 'react';
import { auth } from "../firebase"
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Login = () => {

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [error, setError] = useState('')

    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if(currentUser){
                navigate('/dashboard', { replace: true });
            }
        });
    }, [])


    const handleEmail = (event) => {
        setEmail(event.target.value);
    }

    const handlePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            setError('');
            navigate('/dashboard', { replace: true });
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    }

    return (
        <div className='h-[100vh] w-full mx-auto flex justify-center items-center bg-[hsl(222,18%,15%)]'>
            <div className="w-full max-w-md">
                <form className="bg-slate-700 text-slate-200 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {error && <div className='text-red-400 text-center w-full border-b-2 border-red-500 py-1 my-2 '>{error}</div>}
                    <div className="mb-4">
                        <label className="block  text-sm font-bold mb-2">
                            Email
                        </label>
                        <input className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-slate-500 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" id="username" type="email" onKeyDown={e => e.key === 'Enter' && handleSignIn()} value={email} onChange={handleEmail} />
                    </div>
                    <div className="mb-6">
                        <label className="block  text-sm font-bold mb-2">
                            Password
                        </label>

                        <input className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-slate-500 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" id="password" type="password"  onKeyDown={e => e.key === 'Enter' && handleSignIn()} value={password} onChange={handlePassword} />
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button" onClick={handleSignIn}>
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login