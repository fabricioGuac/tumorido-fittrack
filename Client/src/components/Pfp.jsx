import { useState, useCallback } from "react";

import { useDropzone } from 'react-dropzone';
import { useMutation } from "@apollo/client";

import {SEND_PRESIGNED_URL} from "../utils/mutations";


export default function Pfp ({userPfp}) {
    // Sets the state variables for the error message and teh selected imag
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedImg, setSelectedImg] = useState(userPfp);

    // Mutation to get a presigned URL for uploading
    const [sendPreSignedUrl , {error}] = useMutation(SEND_PRESIGNED_URL);

    // Function to handle file drops
    const onDrop = useCallback( async acceptedFiles => {

        console.log(acceptedFiles);

        // Gets the fisrt accepted file
        const image = acceptedFiles[0];

        if(image){

            try {
                // Requests a presigned URL for uploading the image
                const {data} = await sendPreSignedUrl({
                    variables:{filename:image.name , contentType: image.type},
                });

                // Get the presigned URL from the mutation
                const presignedUrl = data.sendPreSignedUrl;

                // Uploads the image to S3 using the presigned URL
                const AWSresponse = await fetch(presignedUrl, {
                    method:'PUT',
                    body:image,
                    headers:{
                        'Content-Type':image.type,
                    }
                });

                console.log(AWSresponse);

                if(!AWSresponse.ok){
                    throw new Error ('Failed to post the new profile picture');
                }

                console.log(AWSresponse.url);
                console.log('/////////////////////')
                console.log(presignedUrl.split('?')[0]);
                // Updates the profile picture URL
                setSelectedImg(presignedUrl.split('?')[0]);
            } catch (err) {
                console.log(err);
                setErrorMessage(err.message);
            }
        }
    }, [sendPreSignedUrl, error]);

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
