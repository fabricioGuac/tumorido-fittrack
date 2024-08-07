import { useState, useCallback } from "react";

import { useDropzone } from 'react-dropzone';
import { useMutation } from "@apollo/client";

// import {SET_PFP} from "../utils/mutations";


export default function Pfp ({userPfp}) {
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedImg, setSelectedImg] = useState(userPfp);

    const onDrop = useCallback(acceptedFiles => {

        console.log(acceptedFiles);

        const image = acceptedFiles[0];

        if(image){
            const imgURL= URL.createObjectURL(image);
            console.log(imgURL);

            setSelectedImg(imgURL)
        }
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({ onDrop, accept: 'image/*', maxFiles:1 });





    return (
        <>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <img src={selectedImg} alt="profile picture" className='img-fluid rounded-circle mb-4 pfp' />
                {isDragActive ? (
                    <h5>Drop picture here</h5>
                ) : (
                    <h5>Drag and drop your profile picture here</h5>
                )}
            </div>
            {errorMessage && <div className='text-danger'><h5>{errorMessage}</h5></div>}
        </>
    );
}
