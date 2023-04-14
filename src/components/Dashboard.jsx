import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { collection, getDocs } from "firebase/firestore";

import Navbar from './Navbar';
import CarDetails from './CarDetails';
import { db } from '../firebase';
import Table from './Table';
import { StatusPill } from './Table'  // new


const Dashboard = () => {

    const navigate = useNavigate();

    const dbCarRef = collection(db, "voiture");

    const [showDetail, setShowDetail] = useState(false);

    const [cars, setCars] = useState([]);

    const [selectedCarDetails, setSelectedCarDetails] = useState({});

    const data = React.useMemo(() => cars, [cars]);


    useEffect(() => {
        fetchCars();
    }, [])

    const fetchCars = () => {
        setCars([]);
        getDocs(dbCarRef).then(response => {
            response.forEach(doc => {
                let newCar = doc.data();
                setCars(old => {
                    let toAdd = { id: doc.id, Status: newCar.Status, vue: newCar.vue, carrosserie: newCar.carrosserie, fiche_technique: newCar.fiche_technique, motorisation: newCar.motorisation, equipement: newCar.equipement, images: newCar.images, mini: newCar.mini }
                    return [...old, toAdd];
                });
            })
        })
    }

    const handleShowDetail = () => {
        setShowDetail(!showDetail);
    }

    const handleClicShowDetails = (details) => {
        setSelectedCarDetails(details);
        handleShowDetail();
    }

    const columns = React.useMemo(() => [
        {
            Header: "Modèle",
            accessor: 'fiche_technique.Modèle',
        },
        {
            Header: "Prix",
            accessor: 'fiche_technique.Prix TTC',
        },
        {
            Header: "Mise en circulation",
            accessor: 'fiche_technique.Mise en circulation',
        },
        {
            Header: "Kilométrage",
            accessor: 'fiche_technique.Kilométrage',
        },
        {
            Header: "État du véhicule",
            accessor: 'fiche_technique.État du véhicule',
        },
        {
            Header: "Référence",
            accessor: 'fiche_technique.Référence',
        },
        {
            Header: "Nombre de vues",
            accessor: 'vue',
        },
        {
            Header: "Status",
            accessor: 'Status',
            Cell: StatusPill,
        },
    ], [])

    return (
        <div className='bg-[hsl(222,18%,15%)] min-h-[100vh] text-slate-200'>
            <Navbar navigate={navigate} />
            {!showDetail ?
                <div className="min-h-screen">
                    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                        <div className="mt-2">
                            <Table columns={columns} data={data} handleClicShowDetails={handleClicShowDetails} />
                        </div>
                    </main>
                </div>
                : <CarDetails fetchCars={fetchCars} handleShowDetail={handleShowDetail} details={selectedCarDetails} setDetails={setSelectedCarDetails} setCars={setCars} />
            }
        </div >
    )
}

export default Dashboard