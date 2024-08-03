import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Import the necessary modules from Chart.js, this registers all default components needed for chart rendering
import Chart from "chart.js/auto";

import BodyForm from '../components/BodyForm';
import LiftForm from '../components/LiftForm';
import LiftData from '../components/LiftData';
import BodyData from '../components/BodyData';

import { useQuery } from "@apollo/client";

import { GET_ME } from "../utils/queries";

import Auth from '../utils/auth';

export default function Profile() {

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


    if (loading) {
        return <div>Loading...</div>;
    }

    console.log(data);
    return (<>
        <h2>{data?.me.username}</h2>
        <LiftForm liftOptions={liftOptions} />
        <BodyForm />
        <LiftData liftOptions={liftOptions}
        liftsData={lifts}
        />
        <BodyData bodyData={body}
        height={height}
        />
    </>)
}