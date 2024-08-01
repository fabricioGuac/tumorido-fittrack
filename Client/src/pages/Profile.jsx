import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import  BodyForm  from '../components/BodyForm';
import  LiftForm  from '../components/LiftForm';

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

    const lifts = data?.me.lift || [
        {
            "exercise": "Bench Press",
            "sets": [
                {
                    "reps": 10,
                    "weight": 200
                },
                {
                    "reps": 8,
                    "weight": 210
                }
            ]
        },
        {
            "exercise": "Squat",
            "sets": [
                {
                    "reps": 12,
                    "weight": 250
                },
                {
                    "reps": 10,
                    "weight": 260
                }
            ]
        },
        {
            "exercise": "Deadlift",
            "sets": [
                {
                    "reps": 8,
                    "weight": 300
                },
                {
                    "reps": 6,
                    "weight": 320
                }
            ]
        },
        {
            "exercise": "Bench Press",
            "sets": [
                {
                    "reps": 12,
                    "weight": 180
                },
                {
                    "reps": 10,
                    "weight": 190
                }
            ]
        },
        {
            "exercise": "Pull-Up",
            "sets": [
                {
                    "reps": 15,
                    "weight": 0
                },
                {
                    "reps": 12,
                    "weight": 0
                }
            ]
        }
    ]
    ;

    // Filter repeated names
    const liftOptions = lifts.filter((lift, index, meLift) => {
        return index === meLift.findIndex((l) => {
            return l.exercise === lift.exercise;
        })
    } )


    if (loading) {
        return <div>Loading...</div>;
    }

    console.log(data);
    return (<>
    <h2>{data?.me.username}</h2>
    <LiftForm liftOptions={liftOptions} />
    <BodyForm  />
    </>)
}