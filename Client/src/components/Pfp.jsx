import { useState, useCallback } from "react";

import { useDropzone } from 'react-dropzone';
import { useMutation } from "@apollo/client";

import {SEND_PRESIGNED_URL, SET_USER_PFP} from "../utils/mutations";


export default function Pfp ({userPfp}) {
    // Sets the state variables for the error message and teh selected imag
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedImg, setSelectedImg] = useState(userPfp);

    // Mutation to get a presigned URL for uploading
    const [sendPreSignedUrl , {error}] = useMutation(SEND_PRESIGNED_URL);
    // Mutation to set the new profile picture to the user
    const [setPfp, {error: setPfpError}] = useMutation(SET_USER_PFP);


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


                // Updates the user profile picture tp the new image s3 URL
                const {data: pfpUpdateData} = await setPfp({
                    variables: {url:presignedUrl.split('?')[0] }
                })

                // If the response id true it will update the profile picture
                if(pfpUpdateData.setUserPfp){

                    // Updates the profile picture URL
                    setSelectedImg(presignedUrl.split('?')[0]);
                }
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
