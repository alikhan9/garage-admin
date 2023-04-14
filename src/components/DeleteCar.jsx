import { deleteDoc, doc } from '@firebase/firestore';
import React, { useState } from 'react'
import { db } from '../firebase';
import { ref, deleteObject } from '@firebase/storage';
import { storage } from './../firebase';

const DeleteCar = ({ setShowModal, id, handleShowDetail, setCars, details }) => {

    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const docRef = doc(db, "voiture", id);
        deleteDoc(docRef).then(() => {
            setCars(cars => cars.filter(car => car.id !== id))
            setError('');
        }).catch(err => setError(err?.message))

        details?.images.forEach((val, index) => {
            const storageRef = ref(storage, `images/${id}/${val}`);
            deleteObject(storageRef).then(() => {
                handleShowDetail();
                setError('');
            }).catch(err => setError(err?.message))
        })
    }

    return (
        <>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative my-6 mx-auto max-w-[600px] w-[80%]">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[hsl(222,18%,15%)] outline-none focus:outline-none">
                        <div className="flex flex-col items-start justify-between pt-2 rounded-t">
                            <h1 className='text-2xl font-semibold p-8'>Êtes-vous sûr de vouloir supprimer cette voiture?</h1>
                            {error && <p className='p-2 pt-0 mb-6 text-center w-full border-b-2 border-red-400 text-red-500'>{error}</p>}
                        </div>
                        <form className='px-4' onSubmit={handleSubmit}>
                            <div className="flex pb-4 gap-4 w-full">
                                <button
                                    className="bg-slate-500 text-white active:bg-slate-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all w-full duration-150"
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                >
                                    Annuler
                                </button>
                                <button
                                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear w-full transition-all duration-150"
                                    type="submit"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
            <div className="opacity-60 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}

export default DeleteCar