import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import Auth from '../utils/auth';


import ChatOptions from "../components/ChatOptions";
import Chatroom from "../components/Chatroom";

export default function Chats() {

    // Sets the state variable to store the user data
    const [selectedUser, setSelectedUser] =  useState(null);



    const navigate = useNavigate();

    // Redirects the user to the login page if not logged in
    useEffect(() => {
        if (!Auth.loggedIn()) {
            navigate('/login');
        }
    }, []);




    return (
        <>

        <div className="row">
            <div className="col-md-4 overflow-auto">
            <ChatOptions  selectUser={setSelectedUser}/>
            </div>
            <div className="col-md-8">
            <Chatroom receiver={selectedUser}/>
            </div>
        </div>
        </>
    )
}

