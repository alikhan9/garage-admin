import { doc, updateDoc } from '@firebase/firestore';
import React, { useState } from 'react'
import DoubleInput from './DoubleInput';
import { db } from '../firebase';

const EditMotor = ({ id, setShowModal, moteur, setDetails, setCars }) => {

    const [error, setError] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        const moteur = {
            'Puissance réelle': e.target.elements.puissance.value + ' CH',
            'Puissance fiscale': e.target.elements.puissance_fiscale.value + ' CV',
            'Consommation': e.target.elements.consomation.value + ' l/100km',
            'Émission de CO2 (NEDC)': e.target.elements.co2.value + ' g/km',
        }

        const dbMotor = doc(db, 'voiture', id);
        updateDoc(dbMotor, {motorisation : moteur}).then(response => {
            setCars(old => old.map(car => {
                if (car.id !== id)
                    return car;
                car.motorisation = moteur;
                return car;
            }));
            setDetails(old => {
                old.motorisation = moteur;
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
                <div className="relative my-6 mx-auto md:max-w-[600px] w-[80%]">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[hsl(222,18%,15%)] outline-none focus:outline-none">
                        <div className="flex items-start justify-between pt-2 rounded-t">
                            <h1 className='text-2xl font-semibold text-green-400 p-4'>Motorisation</h1>
                            {error && <p className='p-2 pt-0 mb-6 text-center w-full border-b-2 border-red-400 text-red-500'>{error}</p>}
                        </div>
                        <form className='px-4' onSubmit={handleSubmit}>
                            <DoubleInput first_value={"Puissance réelle (CH)"} first_default_value={moteur["Puissance réelle"].split(' ')[0]} second_default_value={moteur["Puissance fiscale"].split(' ')[0]} first_name={"puissance"} first_pattern="\d+$" second_pattern="\d+$" second_value={"Puissance fiscale (CV)"} second_name={"puissance_fiscale"} />
                            <DoubleInput first_value={"Consommation (l/100km) "} first_default_value={moteur["Consommation"].split(' ')[0]} second_default_value={moteur["Émission de CO2 (NEDC)"].split(' ')[0]} first_name={"consomation"} second_value={"Émission de CO2 (NEDC) (g/km)"} second_pattern={"[0-9]{1,5}([,.][0-9]{1,2})?$"} second_name={"co2"} />

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

export default EditMotor