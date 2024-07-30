import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// import { BodyForm } from '../components/BodyForm';
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


    if (loading) {
        return <div>Loading...</div>;
    }

    console.log(data);
    return (<>
    <h2>{data.me.username}</h2>
    <LiftForm />

    </>)
}