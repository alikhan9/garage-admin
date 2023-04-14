import React, { useState } from 'react'
import { db, storage } from '../firebase';
import DoubleInput from './DoubleInput';
import Navbar from './Navbar';
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { useNavigate } from 'react-router';
import ReactImageUploading from 'react-images-uploading';
import { AiFillCloseCircle, AiFillDelete, AiOutlinePlus, } from 'react-icons/ai';
import { useRef, useEffect } from 'react';

const CreateCar = () => {

    const navigate = useNavigate();

    const [images, setImages] = useState([]);

    const [error, setError] = useState('');

    const dbCar = collection(db, 'voiture');

    const dbEquipment = doc(db, 'Equipement', 'v3YvK7i6FfEnQy9m2XqW');

    const refEquipement = useRef();

    const [equipement, setEquipement] = useState([]);

    const [equipementToAdd, setEquipementToAdd] = useState([]);

    const handleSubmit = e => {
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

        const motorisation = {
            'Puissance réelle': e.target.elements.puissance.value + ' CH',
            'Puissance fiscale': e.target.elements.puissance_fiscale.value + ' CV',
            'Consommation': e.target.elements.consomation.value + ' l/100km',
            'Émission de CO2 (NEDC)': e.target.elements.co2.value + ' g/km',
        }

        const carrosserie = {
            'Type de carrosserie': e.target.elements.carrosserie.value,
            'Nombre de portes': e.target.elements.portes.value,
            'Nombre de places': e.target.elements.places.value,
            'Largeur': e.target.elements.largeur.value + ' mm',
            'Longueur': e.target.elements.longueur.value + ' mm',
        }

        let imgsNames = [];
        images.forEach((img, index) => {
            imgsNames.push(img.file.name);
        })


        addDoc(dbCar, {
            Status: "Disponible",
            vue: 0,
            fiche_technique: { ...fiche_technique },
            motorisation: { ...motorisation },
            carrosserie: { ...carrosserie },
            equipement: [...equipementToAdd],
            images: imgsNames
        })
            .then(docRef => {
                const carId = docRef.id;
                uploadImages(carId)
                navigate('/dashboard', { replace: true });
                setError('');
            }).catch(err => setError(err?.message))

    }

    useEffect(() => {
        getDoc(dbEquipment).then(response => {
            const val = response.data();
            setEquipement(val.equipement);
        })
    }, [])

    const genRand = (len) => {
        return Math.random().toString(36).substring(2, len + 2);
    }

    const uploadImages = (id) => {
        const storageRefMini = ref(storage, `images/${id}/mini/${images[0]}`);
        uploadBytes(storageRefMini, images[0].file);
        images.map((img, index) => {
            const pathReference = ref(storage, `images/${id}/normal/${img}`);
            uploadBytes(pathReference, img.file);
            return [];
        })
    }


    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
    };

    const addEquipement = () => {
        const val = refEquipement.current.value;
        if (val && !equipement.includes(val)) {
            setEquipement(old => [...old, val]);
            setEquipementToAdd(old => [...old, val]);
            updateDoc(dbEquipment, { equipement: [...equipement, val] });
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
        updateDoc(dbEquipment, { equipement: equipement.filter(val => val != equipement[index]) });
    }

    return (
        <div className='bg-[hsl(222,18%,15%)] min-h-[100vh] text-gray-200'>
            <Navbar />
            <form className='max-w-[1240px] mx-auto p-6 px-10' onSubmit={handleSubmit}>
                <h1 className='text-xl font-bold text-green-400 py-4'>Fiche Technique</h1>
                {error && <p className='p-2 pt-0 mb-6 text-center w-full border-b-2 border-red-400 text-red-500'>{error}</p>}
                <DoubleInput first_value={"Modèle"} first_name={"modele"} second_value={"Prix (euros)"} second_pattern="^[0-9]{1,9}([,.][0-9]{1,2})?$" second_name={"prix"} />
                <DoubleInput first_value={"Millésime"} first_name={"millesime"} second_value={"Mise en circulation"} first_pattern="[0-9]{4}" second_pattern={"[0-9]{2}/[0-9]{4}"} second_name={"circulation"} />
                <DoubleInput first_value={"Garantie"} first_name={"garantie"} second_value={"État du véhicule"} second_name={"etat"} />
                <DoubleInput first_value={"Couleur"} first_name={"couleur"} second_value={"Référence"} second_name={"reference"} />
                <DoubleInput first_value={"Kilométrage (km)"} first_pattern={"[0-9]{1,3}[ ][0-9]{1,3}"} first_name={"kilometrage"} second_value={"Énergie"} second_name={"energie"} />
                <DoubleInput first_value={"Boîte de vitesse"} first_name={"boite"} second_value={"Finition"} second_name={"finition"} />

                <h1 className='text-xl font-bold text-green-400 py-4'>Motorisation</h1>
                <DoubleInput first_value={"Puissance réelle (CH)"} first_name={"puissance"} first_pattern="\d+$" second_pattern="\d+$" second_value={"Puissance fiscale (CV)"} second_name={"puissance_fiscale"} />
                <DoubleInput first_value={"Consommation (l/100km) "} first_name={"consomation"} second_value={"Émission de CO2 (NEDC) (g/km)"} second_pattern={"[0-9]{1,5}([,.][0-9]{1,2})?$"} second_name={"co2"} />

                <h1 className='text-xl font-bold text-green-400 py-4'>Carrosserie</h1>
                <DoubleInput first_value={"Type de carrosserie"} first_name={"carrosserie"} second_value={"Nombre de portes"} second_pattern="\d+$" second_name={"portes"} />
                <DoubleInput first_value={"Nombre de places"} first_pattern="\d+$" first_name={"places"} second_pattern="^\d+$" second_value={"Largeur (mm)"} second_name={"largeur"} />
                <div className="relative z-0 mb-6 w-[49%] group">
                    <input pattern="^\d+$" type="text" name={"longueur"} id="floating_last_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Longueur (mm)</label>
                </div>
                <h1 className='text-xl font-bold text-green-400 py-4'>Équipements</h1>
                <div className='grid lg:grid-cols-2 gap-4 w-full'>
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


                <h1 className='text-xl font-bold text-green-400 py-4'>Images</h1>
                <ReactImageUploading
                    multiple
                    value={images}
                    onChange={onChange}
                    dataURLKey="data_url"
                    acceptType={["jpg", "png", "jpeg", "gif"]}
                >
                    {({
                        imageList,
                        onImageUpload,
                        onImageRemove,
                        isDragging,
                        dragProps
                    }) => (
                        <div className="upload__image-wrapper">
                            <button
                                type='button'
                                className='border rounded-md p-2 border-slate-400 text-slate-200 font-light'
                                style={isDragging ? { color: "red" } : null}
                                onClick={onImageUpload}
                                {...dragProps}
                            >
                                Cliquer ou faites glisser sur ce button pour ajouter une image
                            </button>
                            &nbsp;
                            <div className='grid grid-cols-6 gap-3'>
                                {imageList.map((image, index) => (
                                    <div key={index} className="relative  w-[150px] h-[100px] image-item py-6 flex flex-col items-center gap-2 mb-10">
                                        <img src={image.data_url} alt="" className='rounded-md w-[150px] h-[100px] opacity-80' />
                                        <AiFillCloseCircle className='absolute right-0 hover:cursor-pointer' size={25} color='rgb(185 28 28 )' onClick={() => { onImageRemove(index) }} />
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}
                </ReactImageUploading>
                <div className='flex justify-end'>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Valider</button>
                </div>
            </form>
        </div >
    )
}

export default CreateCar