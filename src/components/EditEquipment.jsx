import { doc, getDoc, updateDoc } from '@firebase/firestore';
import React, { useEffect, useState } from 'react'
import DoubleInput from './DoubleInput';
import { db } from '../firebase';
import { useRef } from 'react';
import { AiFillDelete, AiOutlinePlus } from 'react-icons/ai';

const EditEquipment = ({ id, setShowModal, equipment, setDetails, setCars }) => {

    const [error, setError] = useState('');

    const [equipement, setEquipement] = useState([]);

    const [equipementToAdd, setEquipementToAdd] = useState(equipment);

    const refEquipement = useRef();

    const dbCar = doc(db, 'voiture', id);

    const dbEquipment = doc(db, 'Equipement', 'v3YvK7i6FfEnQy9m2XqW');

    useEffect(() => {
        getDoc(dbEquipment).then(response => {
            const val = response.data();
            setEquipement(val.equipement);
        })
    }, [])

    const addEquipement = () => {
        const val = refEquipement.current.value;
        if (val && !equipement.includes(val)) {
            setEquipement(old => [...old, val]);
            setEquipementToAdd(old => [...old, val]);
            updateDoc(dbCar, { equipement: [...equipement, val] });
            refEquipement.current.value = '';
        }
    }

    const addEquipementToList = index => {
        if (!equipementToAdd.includes(equipement[index]))
            setEquipementToAdd(old => [...old, equipement[index]]);
        else
            setEquipementToAdd(old => old.filter(val => val !== equipement[index]));
    }

    const deleteEquipement = index => {
        if (equipementToAdd.includes(equipement[index]))
            setEquipementToAdd(old => old.filter(val => val !== equipement[index]));
        setEquipement(old => old.filter(val => val !== equipement[index]));
        updateDoc(dbCar, { equipement: equipement.filter(val => val !== equipement[index]) });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        updateDoc(dbCar, { equipement: [...equipementToAdd] }).then(response => {
            setCars(old => old.map(car => {
                if (car.id !== id)
                    return car;
                car.equipement = equipementToAdd;
                return car;
            }));
            setDetails(old => {
                old.equipement = equipementToAdd;
                return old;
            });
            setShowModal();
            setError('');
        }).catch(err => setError(err?.message))

    }

    return (
        <>
            <div
                className="justify-center items-center md:flex inset-0 z-50 fixed outline-none focus:outline-none"
            >
                <div className="relative my-6 mx-auto md:max-w-[1240px] max-w-[80%]">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[hsl(222,18%,15%)] outline-none focus:outline-none">
                        <div className="flex items-start justify-between pt-2 rounded-t">
                            <h1 className='text-2xl font-semibold text-green-400 p-4'>Équipements</h1>
                            {error && <p className='p-2 pt-0 mb-6 text-center w-full border-b-2 border-red-400 text-red-500'>{error}</p>}
                        </div>
                        <form className='px-4' onSubmit={handleSubmit}>
                            <div className='grid lg:grid-cols-2 gap-4 w-full overflow-auto md:max-h-[80vh] max-h-[70vh] custom-scroll'>
                                {equipement?.map((val, index) => {
                                    return <div key={index} className="flex justify-between items-center">
                                        <div className={`${equipementToAdd.includes(val) ? "opacity-100" : "opacity-60"}  md:max-w-full max-w-[80%] flex gap-4 items-center hover:cursor-pointer hover:scale-[1.005] duration-300`} onClick={() => addEquipementToList(index)}>
                                            <AiOutlinePlus className={`border ${equipementToAdd.includes(val) ? "border-green-400" : "border-transparent"} rounded-md`} size={22} color={`${equipementToAdd.includes(val) ? "rgb(74 222 128)" : "rgb(226 232 240)"}`} />
                                            <p className={`text-sm font-light md:max-w-full max-w-[80%]`}>{val}</p>
                                        </div>
                                        <AiFillDelete className='mr-[5%] hover:cursor-pointer hover:scale-[1.05]' size={18} color={'rgb(239 68 68)'} onClick={() => deleteEquipement(index)} />
                                    </div>
                                })}
                            </div>

                            <div className='flex items-center py-4 gap-4'>
                                <input ref={refEquipement} type="text" placeholder='Ajouter un nouvel equipement' className='w-[70%] block py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer' />
                                <button type="button" className='p-2 w-[25%] bg-slate-700 active:bg-slate-800 rounded-lg' onClick={addEquipement}>Ajouter</button>
                            </div>
                            <div className="flex pb-2 gap-4 w-full">
                                <button
                                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all w-full duration-150"
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                >
                                    Annuler
                                </button>
                                <button
                                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear w-full transition-all duration-150"
                                    type="submit"
                                >
                                    Sauvegarder
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

export default EditEquipment;