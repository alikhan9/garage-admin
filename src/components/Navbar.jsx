import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import { onAuthStateChanged, signOut } from '@firebase/auth';
import { auth } from './../firebase';

const Navbar = () => {


    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                return;
            } else {
                navigate('/', { replace: true });
            }
        });
    }, [])

    const logout = async () => {
        await signOut(auth);
        navigate('/', { replace: true });
    };

    const redirectToCars = () => {
        navigate('/dashboard', { replace: true });
    }

    const redirectToAddCar = () => {
        navigate('/create', { replace: true });
    }


    return (
        <div className='bg-[#171A21] w-full'>
            <div className='flex justify-between items-center p-10 h-24 max-w-[1240px] mx-auto text-green-400'>
                <div className='text-3xl font-bold'>
                    ASM AUTO
                </div>
                <ul className='flex gap-10 text-xl'>
                    <li className='hover-underline-animation' onClick={redirectToCars} >
                        Véhicules
                    </li>
                    <li className='hover-underline-animation' onClick={redirectToAddCar}>
                        Nouveau
                    </li>
                    <li className='hover-underline-animation' onClick={logout}>
                        Déconnexion
                    </li>
                </ul>
            </div>
        </div>

    )
}

export default Navbar