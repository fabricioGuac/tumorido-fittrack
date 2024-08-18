import { useEffect, useState } from "react";

import { useQuery } from "@apollo/client";

import { GET_CHAT_OPTIONS } from "../utils/queries";


export default function ChatOptions ({selectUser}) {




        // Defines the state variables to store the options
        const [userOptions, setUserOptions] = useState([]);
    
        const {loading, data} = useQuery(GET_CHAT_OPTIONS);
    
        // UseEffect to update the userOptions
        useEffect (() => {
            
            if(data){
            setUserOptions(data.getChatOptions);
            }
        }, [data])
    
        // Function to handle an user selection
        const handleUserSelect = (id) => {

            // Filter the options to get the data from the selecte user
            const filteredUser = userOptions.filter( chat => chat._id === id);

            // Sets the state variable to the data of the selected user
            selectUser(filteredUser[0]);
        }
    
        if (loading) {
            return (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <h2 className="text-primary">Loading...</h2>
                </div>)
        }
    
        return (
            <>
        
            <div>
                <h3 className="text-center">Chat with users</h3>
                {userOptions.length > 0 ? (
                    userOptions.map(user => (
                        <div key={user._id} onClick={() => handleUserSelect(user._id)} className="row align-items-center mt-3 chat-options">
                        <div className="col-2">
                            <img src={user.pfp || '/defaultPfp.png'} className="img-fluid rounded-circle mb-4" alt="Profile Picture" />
                        </div>
                        <div className="col-10">
                            <h3>{user.username}</h3>
                        </div>
                    </div>
                    ))
                ) : (
                    <h4>No users to chat with</h4>
                )}
            </div>
    
    
            </>
        )
}