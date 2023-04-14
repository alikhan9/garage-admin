import { doc, updateDoc } from '@firebase/firestore';
import React, { useState } from 'react'
import DoubleInput from './DoubleInput';
import { db } from '../firebase';

const EditDetails = ({ id, setShowModal, details, setCars, setDetails }) => {

    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const fiche_technique = {
            'Prix TTC': e.target.elements.prix.value + ' €',
            'Millésime': e.target.elements.millesime.value,
            'Modèle': e.target.elements.modele.value,
            'Mise en circulation': e.target.elements.circulation.value,
            'Garantie': e.target.elements.garantie.value,
            'État du véhicule': e.target.elements.etat.value,
            'Couleur': e.target.elements.couleur.value,
            'Référence': e.target.elements.reference.value,
            'Kilométrage': e.target.elements.kilometrage.value + ' KM',
            'Énergie': e.target.elements.energie.value,
            'Boîte de vitesse': e.target.elements.boite.value,
            'Finition': e.target.elements.finition.value,
        }

        const dbDetails = doc(db, 'voiture', id);
        updateDoc(dbDetails, { fiche_technique: fiche_technique }).then(response => {
            setCars(old => old.map(car => {
                if (car.id !== id)
                    return car;
                car.fiche_technique = fiche_technique;
                return car;
            }));
            setDetails(old => {
                old.fiche_technique = fiche_technique;
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
                            <h1 className='text-2xl font-semibold text-green-400 p-4'>Fiche Technique</h1>
                            {error && <p className='p-2 pt-0 mb-6 text-center w-full border-b-2 border-red-400 text-red-500'>{error}</p>}
                        </div>
                        <form className='px-4' onSubmit={handleSubmit}>
                            <DoubleInput first_value={"Modèle"} first_default_value={details["Modèle"]} second_default_value={details["Prix TTC"].split(' ')[0]} first_name={"modele"} second_value={"Prix (euros)"} second_pattern="^[0-9]{1,9}([,.][0-9]{1,2})?$" second_name={"prix"} />
                            <DoubleInput first_value={"Millésime"} first_default_value={details["Millésime"]} second_default_value={details["Mise en circulation"]} first_name={"millesime"} second_value={"Mise en circulation"} first_pattern="[0-9]{4}" second_pattern={"[0-9]{2}/[0-9]{4}"} second_name={"circulation"} />
                            <DoubleInput first_value={"Garantie"} first_name={"garantie"} first_default_value={details["Garantie"]} second_default_value={details["État du véhicule"]} second_value={"État du véhicule"} second_name={"etat"} />
                            <DoubleInput first_value={"Couleur"} first_name={"couleur"} first_default_value={details["Couleur"]} second_default_value={details["Référence"]} second_value={"Référence"} second_name={"reference"} />
                            <DoubleInput first_value={"Kilométrage (km)"} first_default_value={details["Kilométrage"].replace(/\D/g, '')} second_default_value={details["Énergie"]} first_pattern={"^[0-9]{1,9}([,.][0-9]{1,2})?$"} first_name={"kilometrage"} second_value={"Énergie"} second_name={"energie"} />
                            <DoubleInput first_value={"Boîte de vitesse"} first_default_value={details["Boîte de vitesse"]} first_name={"boite"} second_default_value={details["Finition"]} second_value={"Finition"} second_name={"finition"} />
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

export default EditDetails