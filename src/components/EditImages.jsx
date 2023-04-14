import React, { useState } from 'react'
import ReactImageUploading from 'react-images-uploading';
import { AiFillCloseCircle } from 'react-icons/ai';
import { uploadBytes } from 'firebase/storage';
import { db, storage } from './../firebase';
import { deleteObject, ref, getDownloadURL } from '@firebase/storage';
import { doc, updateDoc } from '@firebase/firestore';

const EditImages = ({ id, setShowModal, imgs, fetchImages, fetchCars, details, setCars }) => {

    const [error, setError] = useState('');

    const [images, setImages] = useState(imgs.map(img => { return { data_url: img.src, file: { name: img.filename, order: img.order } } }));

    const handleSubmit = (e) => {
        e.preventDefault();

        let filesToDelete = [];
        let filesToUpload = [];

        images.sort((a, b) => a.file.order - b.file.order);

        // Check if any images have been deleted
        imgs.forEach(img => {
            let add = true;
            images.forEach(newImg => {
                if (newImg.file.name === img.filename)
                    add = false;
            })
            if (add)
                filesToDelete.push(img.filename)
        })

        // Check if any images have been added
        images.forEach(img => {
            let add = true;
            imgs.forEach(newImg => {
                if (img.file.name === newImg.filename)
                    add = false;
            })
            if (add)
                filesToUpload.push({ file: img.file, order: img.order })
        })

        // Delete files from storage
        filesToDelete.forEach((img, index) => {
            const storageRef = ref(storage, `images/${id}/normal/${img}`);
            deleteObject(storageRef);
        })

        // Delete thumbnail files from storage
        if (details.mini && details.mini.lenght > 0) {
            const storageRef = ref(storage, `images/${id}/mini/${details.mini}`);
            deleteObject(storageRef);
        }



        filesToUpload.sort((a, b) => a.order > b.order ? 1 : -1);
        // Upload files to storage and updates local images
        let newImgs = [];

        filesToUpload.forEach((img, index) => {
            const storageRef = ref(storage, `images/${id}/normal/${img.file.name}`);
            if (index === 0) {
                const storageRefMini = ref(storage, `images/${id}/mini/${img.file.name}`);
                uploadBytes(storageRefMini, img.file);
            }
            uploadBytes(storageRef, img.file).then((item) => {
                getDownloadURL(item.ref).then((url) => {
                    newImgs.push({
                        filename: img.file.name,
                        src: url,
                        sizes: '(max-width: 400px) 400px',
                        alt: `...`,
                        thumbnail: url,
                        order: img.order
                    });
                })
            })
        })

        // Updates the car details
        let mini = "";
        let imgsNames = [];
        images.forEach((img, index) => {
            if (img.order === 0) {
                if (!img.file.name.includes(".webp"))
                    mini = img.file.name.split('.')[0] + "_400x300.webp";
                else
                    mini = img.file.name.replace("_2560x1440.webp", "_400x300.webp");
            }
            if (!img.file.name.includes('webp'))
                imgsNames.push(img.file.name.split('.')[0] + "_2560x1440.webp");
            else
                imgsNames.push(img.file.name);
        })

        setCars(cars => cars.map(car => car.id === id ? { ...car, images: imgsNames, mini: mini } : car));

        // Updates the car details in the database
        const carRef = doc(db, 'voiture', details.id);
        updateDoc(carRef, { images: imgsNames, mini }).then(() => {
        });
        fetchCars();
        setShowModal(false);
    }


    const onChange = (imageList, addUpdateIndex) => {
        const newList = imageList.map((img, index) => {
            return { data_url: img.data_url, file: img.file, order: index }
        });
        setImages(newList);
    };

    return (
        <>
            <div
                className="justify-center items-center md:flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative my-6 mx-auto md:max-w-[600px] w-[80%]">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[hsl(222,18%,15%)] outline-none focus:outline-none">
                        <div className="flex items-start justify-between pt-2 rounded-t">
                            <h1 className='text-2xl font-semibold text-green-400 p-4'>Images</h1>
                            {error && <p className='p-2 pt-0 mb-6 text-center w-full border-b-2 border-red-400 text-red-500'>{error}</p>}
                        </div>
                        <form className='px-4' onSubmit={handleSubmit}>
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
                                        <div className='grid grid-cols-3 gap-3'>
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
                            <div className="flex pt-4 pb-2 gap-4 w-full">
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

export default EditImages;