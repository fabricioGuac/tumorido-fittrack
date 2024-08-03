import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Import the necessary modules from Chart.js, this registers all default components needed for chart rendering
import Chart from "chart.js/auto";

import BodyForm from '../components/BodyForm';
import LiftForm from '../components/LiftForm';
import LiftData from '../components/LiftData';
import BodyData from '../components/BodyData';

import { useQuery, useMutation } from "@apollo/client";

import { GET_ME } from "../utils/queries";
// import {SET_PFP} from "../utils/mutations";

import Auth from '../utils/auth';

export default function Profile() {

    const [view, setView] = useState('bodyData');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    // Redirects the user to the login page if not logged in
    useEffect(() => {
        if (!Auth.loggedIn()) {
            navigate('/login');
        }


    }, []);

    const { loading, data } = useQuery(GET_ME);

    const lifts = data?.me.lift || [];
    const body = data?.me.body || [];
    const height = data?.me.height || 0

    // Filter repeated names
    const liftOptions = lifts.filter((lift, index, meLift) => {
        return index === meLift.findIndex((l) => {
            return l.exercise === lift.exercise;
        })
    })

    // const [setPfp, { error }] = useMutation(SET_PFP);

    // const handlePfpUpload = async () => {
    //     try {
    //         const {data} = await setPfp({
    //             variables:{ file: pfp }
    //         });

    //     } catch (err) {
    //         console.log(err.message);
    //         setErrorMessage(err.message);
    //     }
    // }

    if (loading) {
        return <div>Loading...</div>;
    }

    console.log(data);
    return (
        <>
            <div className='row'>
                <div className='col-md-2'>
                    <div>
                        <h2>{data?.me.username}</h2>
                        <img src={data?.me.profilePic} alt="profile picture" className='img-fluid' />
                        {/* <input type="file" accept="image/*" onChange={handlePfpUpload} /> */}
                        {errorMessage && <div className='text-danger'>{errorMessage}</div>}
                        <ul>
                            <li onClick={() => setView("bodyData")}>Body data</li>
                            <li onClick={() => setView("bodyForm")}>Add new body data</li>
                            <li onClick={() => setView("liftData")}>Lift data</li>
                            <li onClick={() => setView("liftForm")}>Add new lift</li>
                        </ul>
                    </div>
                </div>
                <div className='col-md-10'>
                    {view === "bodyData" && <BodyData bodyData={body} height={height} />}
                    {view === "bodyForm" && <BodyForm />}
                    {view === "liftForm" && <LiftForm liftOptions={liftOptions} />}
                    {view === "liftData" && <LiftData liftOptions={liftOptions} liftsData={lifts} />}
                </div>
            </div>
        </>
    );
}