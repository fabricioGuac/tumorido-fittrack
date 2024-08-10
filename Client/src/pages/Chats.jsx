import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


import { useQuery, useMutation } from "@apollo/client";


export default function Chats () {

    const navigate = useNavigate();

    // Redirects the user to the login page if not logged in
    useEffect(() => {
        if (!Auth.loggedIn()) {
            navigate('/login');
        }
    }, []);


    const [userOptions, setUserOptions] = useState('');
    const [chatroomOtions, setRoomOptions] = useState('');

    const {loading, data} = useQuery('')

    return (
        <>
        <h1>CHAT</h1>


        </>
    )
}