import React, { useEffect, useState } from 'react'
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';
import { AiFillCaretRight, AiFillEdit } from 'react-icons/ai'
import DoubleDivFlex from './DoubleDivFlex';
import { doc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import EditDetails from './EditDetails';
import EditMotor from './EditMotor';
import EditCarBody from './EditCarBody';
import DeleteCar from './DeleteCar';
import EditImages from './EditImages';
import { updateDoc } from '@firebase/firestore';
import { getDownloadURL, ref } from '@firebase/storage';
import EditEquipment from './EditEquipment';

const CarDetails = ({ handleShowDetail, details, setCars, setDetails, fetchCars }) => {

    const [showEditDetails, setShowEditDetails] = useState(false);

    const [showEditEquipement, setShowEditEquipement] = useState(false);

    const [showEditImages, setShowEditImages] = useState(false);

    const [showDeleteCar, setShowDeleteCar] = useState(false);

    const [showEditCarrosserie, setShowEditCarrosserie] = useState(false);

    const [showEditMoteur, setShowEditMoteur] = useState(false);

    const [images, setImages] = useState([]);

    const id = details.id;

    useEffect(() => {
        fetchImages();
    }, [])

    const fetchImages = (imgsNames) => {
        setImages([]);
            details?.images?.forEach((img, index) => {
                const pathReference = ref(storage, `images/${details.id}/normal/${img}`);
                getDownloadURL(pathReference).then((url) => {
                    setImages((prev) => [...prev, {
                        filename: img,
                        src: url,
                        sizes: '(max-width: 400px) 400px',
                        alt: `...`,
                        thumbnail: url,
                        order: index
                    }]);
                });
            });
    }

    const handleChangeStatus = () => {
        const dbCar = doc(db, "voiture", id);
        let newStatus = details.Status === "Disponible" ? "Vendu" : "Disponible";
        updateDoc(dbCar, { Status: newStatus })
        setDetails(car => {
            car.Status = newStatus;
            return car;
        });
        setCars(cars => {
            return cars.map(car => {
                if (car.id !== id)
                    return car;
                car.Status = newStatus;
                return car;
            })
        })
    }

    return (
        <div className='md:max-w-[1240px] w-[100vw] mx-auto p-8 bg-[hsl(222,18%,15%)]'>
            {showEditDetails ? <EditDetails setShowModal={setShowEditDetails} details={details.fiche_technique} id={id} setCars={setCars} setDetails={setDetails} /> : null}
            {showEditMoteur ? <EditMotor setShowModal={setShowEditMoteur} moteur={details.motorisation} id={id} setDetails={setDetails} setCars={setCars} /> : null}
            {showEditCarrosserie ? <EditCarBody setShowModal={setShowEditCarrosserie} setDetails={setDetails} setCars={setCars} carrosserie={details.carrosserie} id={id} /> : null}
            {showDeleteCar ? <DeleteCar setShowModal={setShowDeleteCar} details={details} id={id} setCars={setCars} handleShowDetail={handleShowDetail} /> : null}
            {showEditImages ? <EditImages fetchCars={fetchCars} fetchImages={fetchImages} setCars={setCars} details={details} setShowModal={setShowEditImages} id={id} imgs={images} setImgs={setImages} /> : null}
            {showEditEquipement ? <EditEquipment setShowModal={setShowEditEquipement} id={id} equipment={details.equipement} setDetails={setDetails} setCars={setCars} /> : null}
            <div className="lg:float-right relative right-0 hover:cursor-pointer text-xl border rounded-md p-2 text-red-400 border-red-400 text-center w-[100px] " onClick={handleShowDetail}>Retour</div>
            <div className='lg:grid md:grid-cols-7 w-full'>
                <div className='flex justify-between items-center md:max-w-[600px] md:col-end-5 col-start-1'>
                    <h1 className='text-2xl font-bold p-3 '>{details.fiche_technique['Modèle']}</h1>
                    <div>
                        <label htmlFor="default-toggle-size" className="inline-flex relative items-center shadow-transparent cursor-pointer ">
                            <input type="checkbox" value="" id="default-toggle-size" className="sr-only peer shadow-transparent" checked={details.Status === "Disponible"} onChange={handleChangeStatus} />
                            <div className={`w-14 h-7 bg-gray-200 shadow-transparent peer-focus:outline-none outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:${details.Status === "Disponible" ? "bg-gray-700" : "bg-red-500"} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600`}></div>
                            <span className="ml-3 text-xl text-gray-900 dark:text-gray-300">{details.Status}</span>
                        </label>
                    </div>
                    <AiFillEdit size={25} color={'rgb(253 186 116'} className="hover:cursor-pointer" onClickCapture={() => setShowEditImages(true)} />
                </div>
            </div>
            <div className='lg:grid md:grid-cols-7 w-full gap-8' >
                <div className='py-2 md:max-w-[600px] md:col-end-5 col-start-1 rounded-lg'>
                    <Carousel images={images?.sort((a, b) => a.order > b.order ? 1 : -1)} isLoop={false} hasLeftButton={false} hasRightButton={false} hasIndexBoard={"topRight"} shouldLazyLoad={true} canAutoPlay={false} shouldMaximizeOnClick={true} shouldMinimizeOnClick={true} hasSizeButton={false} widgetsHasShadow={false} style={{ height: 470, maxWidth: 600, background: 'hsl(222,18%,15%)' }} />
                </div>
                <div className='col-start-6 col-span-2 md:col-start-5 md:col-span-4 lg:pt-0 pt-10'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-xl font-bold text-green-400 pt-1 lg:pb-1'>Fiche Technique</h1>
                        <AiFillEdit size={25} color={'rgb(253 186 116'} className="hover:cursor-pointer" onClickCapture={() => setShowEditDetails(true)} />
                    </div>
                    <DoubleDivFlex name={"Modèle"} value={details.fiche_technique['Modèle']} />
                    <DoubleDivFlex name={"Prix TTC"} value={details.fiche_technique['Prix TTC']} />
                    <DoubleDivFlex name={"Finition"} value={details.fiche_technique['Finition']} />
                    <DoubleDivFlex name={"Kilométrage"} value={details.fiche_technique['Kilométrage']} />
                    <DoubleDivFlex name={"Boîte de vitesse"} value={details.fiche_technique['Boîte de vitesse']} />
                    <DoubleDivFlex name={"Énergie"} value={details.fiche_technique['Énergie']} />
                    <DoubleDivFlex name={"Mise en circulation"} value={details.fiche_technique['Mise en circulation']} />
                    <DoubleDivFlex name={"Garantie"} value={details.fiche_technique['Garantie']} />
                    <DoubleDivFlex name={"État du véhicule"} value={details.fiche_technique['État du véhicule']} />

                </div>
            </div>

            <div className='lg:grid grid-cols-7 pb-8 py-10'>
                <div className='col-start-1 col-end-5 lg:max-w-md pb-10'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-xl font-bold text-green-400 pt-1 lg:pb-1'>Motorisation</h1>
                        <AiFillEdit size={25} color={'rgb(253 186 116'} className="hover:cursor-pointer" onClickCapture={() => setShowEditMoteur(true)} />
                    </div>
                    <DoubleDivFlex name={"Puissance réelle"} value={details.motorisation['Puissance réelle']} />
                    <DoubleDivFlex name={"Puissance fiscale"} value={details.motorisation['Puissance fiscale']} />
                    <DoubleDivFlex name={"Consommation"} value={details.motorisation['Consommation']} />
                    <DoubleDivFlex name={"Émission de CO2 (NEDC)"} value={details.motorisation['Émission de CO2 (NEDC)']} />

                </div>
                <div className='col-start-5 col-span-3 md:py-0 py-4'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-xl font-bold text-green-400 pt-1 lg:pb-1'>Carrosserie</h1>
                        <AiFillEdit size={25} color={'rgb(253 186 116'} className="hover:cursor-pointer" onClickCapture={() => setShowEditCarrosserie(true)} />
                    </div>
                    <DoubleDivFlex name={"Type de carrosserie"} value={details.carrosserie['Type de carrosserie']} />
                    <DoubleDivFlex name={"Nombre de portes"} value={details.carrosserie['Nombre de portes']} />
                    <DoubleDivFlex name={"Nombre de places"} value={details.carrosserie['Nombre de places']} />
                    <DoubleDivFlex name={"Largeur"} value={details.carrosserie['Largeur']} />
                    <DoubleDivFlex name={"Longueur"} value={details.carrosserie['Longueur']} />
                </div>
            </div>

            <div className='flex justify-between items-center lg:max-w-[450px]'>
                <h1 className='text-xl font-bold text-green-400 lg:pb-1'>Equipements</h1>
                <AiFillEdit size={25} color={'rgb(253 186 116'} className="hover:cursor-pointer" onClickCapture={() => setShowEditEquipement(true)} />
            </div>
            <div className='border-b-2 border-slate-500 pb-10 pt-2 gap-2 grid lg:grid-cols-2'>
                {details.equipement.map((val, index) => {
                    return <div key={index} className='flex items-center gap-2 font-light text-slate-300'><AiFillCaretRight size={15} color="rgb(251 146 60)" /><div>{val}</div></div>
                })}
            </div>
            <div className='flex justify-center items-center pt-4 gap-[5%]'>
                <button onClickCapture={() => setShowDeleteCar(true)} className='bg-red-500 max-w-[200px] text-slate-100 active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all w-full duration-150'>Supprimer</button>
            </div>
        </div>
    )
}

export default CarDetails;