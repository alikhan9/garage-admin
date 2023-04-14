import { doc, updateDoc } from '@firebase/firestore';
import React, { useState } from 'react'
import DoubleInput from './DoubleInput';
import { db } from '../firebase';

const EditCarBody = ({ id, setShowModal, carrosserie, setDetails, setCars }) => {

    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const carrosserie = {
            'Type de carrosserie': e.target.elements.carrosserie.value,
            'Nombre de portes': e.target.elements.portes.value,
            'Nombre de places': e.target.elements.places.value,
            'Largeur': e.target.elements.largeur.value + ' mm',
            'Longueur': e.target.elements.longueur.value + ' mm',
        }

        const dbMotor = doc(db, 'voiture', id);
        updateDoc(dbMotor, { carrosserie: carrosserie }).then(response => {
            setCars(old => old.map(car => {
                if (car.id !== id)
                    return car;
                car.carrosserie = carrosserie;
                return car;
            }));
            setDetails(old => {
                old.carrosserie = carrosserie;
                return old;
            });
            setShowModal();
            setError('');
        }).catch(err => setError(err?.message))

    }


    return (
        <>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative my-6 mx-auto max-w-[600px] w-[80%]">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[hsl(222,18%,15%)] outline-none focus:outline-none">
                        <div className="flex items-start justify-between pt-2 rounded-t">
                            <h1 className='text-2xl font-semibold text-green-400 p-4'>Carrosserie</h1>
                        </div>
                        {error && <p className='p-2 pt-0 mb-6 text-center w-full border-b-2 border-red-400 text-red-500'>{error}</p>}
                        <form className='px-4' onSubmit={handleSubmit}>
                            <DoubleInput first_value={"Type de carrosserie"} first_default_value={carrosserie["Type de carrosserie"]} second_default_value={carrosserie["Nombre de portes"]} first_name={"carrosserie"} second_value={"Nombre de portes"} second_pattern="\d+$" second_name={"portes"} />
                            <DoubleInput first_value={"Nombre de places"} first_default_value={carrosserie["Nombre de places"]} second_default_value={carrosserie["Largeur"].split(' ')[0]} first_pattern="\d+$" first_name={"places"} second_pattern="^\d+$" second_value={"Largeur (mm)"} second_name={"largeur"} />
                            <div className="relative z-0 mb-6 w-[49%] group">
                                <input pattern="^\d+$" type="text" name={"longueur"} defaultValue={carrosserie["Longueur"].split(' ')[0]} id="floating_last_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Longueur (mm)</label>
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

export default EditCarBody;