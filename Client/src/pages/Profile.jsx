import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Import the necessary modules from Chart.js, this registers all default components needed for chart rendering
import Chart from "chart.js/auto";

import BodyForm from '../components/BodyForm';
import LiftForm from '../components/LiftForm';
import LiftData from '../components/LiftData';
import BodyData from '../components/BodyData';
import Pfp from '../components/Pfp';

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
    const userPfp = data?.me.pfp || '/defaultPfp.png'

    // Filter repeated names
    const liftOptions = lifts.filter((lift, index, meLift) => {
        return index === meLift.findIndex((l) => {
            return l.exercise === lift.exercise;
        })
    })


    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <h2 className="text-primary">Loading...</h2>
            </div>)
    }

    console.log(data);

    return (
        <>
            <div className='p-4'>
                <div className='row'>
                    <div className='col-md-2 profile-sidebar'>
                        <div className='row text-center'>
                            
                            <h2 className='username'>{data?.me.username}</h2>

                            <Pfp userPfp={userPfp} />

                            {errorMessage && <div className='text-danger'>{errorMessage}</div>}
                            <ul className='profile-nav'>
                                <li
                                    onClick={() => setView("bodyData")}
                                    className={view === "bodyData" ? "activeView" : ""}
                                >
                                    Body data
                                </li>
                                <li
                                    onClick={() => setView("bodyForm")}
                                    className={view === "bodyForm" ? "activeView" : ""}
                                >
                                    Add new body data
                                </li>
                                <li
                                    onClick={() => setView("liftData")}
                                    className={view === "liftData" ? "activeView" : ""}
                                >
                                    Lift data
                                </li>
                                <li
                                    onClick={() => setView("liftForm")}
                                    className={view === "liftForm" ? "activeView" : ""}
                                >
                                    Add new lift
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className='col-md-10'>
                        {view === "bodyData" && <BodyData bodyData={body} height={height} />}
                        {view === "bodyForm" && <BodyForm setView={setView} />}
                        {view === "liftForm" && <LiftForm liftOptions={liftOptions} />}
                        {view === "liftData" && <LiftData liftOptions={liftOptions} liftsData={lifts} />}
                    </div>
                </div>
            </div>
        </>
    );
}