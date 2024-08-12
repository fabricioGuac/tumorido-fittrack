import { useEffect, useState } from "react";

import { useMutation, useQuery } from "@apollo/client";
import { GET_CHAT } from "../utils/queries";
import { SEND_MESSAGE } from "../utils/mutations";

export default function Chatroom({ receiver }) {

    const [message, setMessage] = useState('');
    const [chatroom, setChatroom] = useState([]);

    const [sendMessage, { loading, error }] = useMutation(SEND_MESSAGE);

    const { data: chatData, loading: chatLoading } = useQuery(GET_CHAT, {
        variables: { userId: receiver?._id },
    });

    useEffect(() => {
        if (chatData?.getChat) {
            setChatroom(chatData?.getChat);
        }
    }, [chatData])


    const handleInputChange = (e) => {
        setMessage(e.target.value);
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();

        try {
            await sendMessage({
                variables: { content: message, receiver: receiver._id }
            })



            setMessage('');
            console.log('Message sent:', message);

        } catch (err) {
            console.log(err.message);
        }
    }

    if (!receiver) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <h2>Select a chat</h2>
            </div>)
    }

    if (chatLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <h2 className="text-primary">Loading...</h2>
            </div>)
    }

    return (
        <div className="chatroom-container">
            <div className="chat-header ">
                <img
                    src={receiver.pfp || '/defaultPfp.png'}
                    alt="Profile"
                    className="img-fluid rounded-circle me-3 chat-pfp"
                />
                <h3>{receiver.username}</h3>
            </div>

            <div className="chat-messages">
                {chatroom.length > 0 ? (
                    chatroom.map(msg => (
                        <div
                            key={msg._id}
                            className={`message ${msg.sender !== receiver._id ? 'sent' : 'received'}`}
                        >
                            <div className="message-header">
                                <strong>{msg.sender === receiver._id ? receiver.username : 'You'}</strong>
                            </div>
                            <p>{msg.content}</p>
                            <small className="message-date">{new Date(msg.date).toLocaleString()}</small>
                        </div>
                    ))
                ) : (
                    <h4 className="d-flex justify-content align-center">
                        Send a message to start the conversation
                    </h4>
                )}
            </div>

            <form className="message-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Send a message"
                    className="form-control mb-2"
                    value={message}
                    onChange={handleInputChange}
                />
                <button type="submit" className="btn btn-success" disabled={!message.trim() || loading}>
                    📤 Send
                </button>
            </form>
        </div>


    )
}