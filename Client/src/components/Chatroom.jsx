import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

import { useMutation, useQuery } from "@apollo/client";
import { GET_CHAT } from "../utils/queries";
import { SEND_MESSAGE } from "../utils/mutations";

export default function Chatroom({ receiver }) {

    // Sets the state variables
    const [message, setMessage] = useState('');
    const [chatroom, setChatroom] = useState([]);
    const [roomId, setRoomId] = useState(null);

    // Mutation to send the messages
    const [sendMessage, { loading, error }] = useMutation(SEND_MESSAGE);

    // Query to retrieve the chat data
    const { data: chatData, loading: chatLoading, refetch } = useQuery(GET_CHAT, {
        variables: { userId: receiver?._id },
    });

    // Reference used to scroll to the end of the chats
    const chatEndRef = useRef(null);

    // Socket.io client instance
    const socket = useRef(null);

    // UseEffect to refetch chat data when receiver changes
    useEffect(() => {
        if (receiver?._id) {
            refetch();
        }
    }, [receiver, refetch]);


    // UseEffect to update the chatroom messages and the room id when the chat data changes
    useEffect(() => {
        if (chatData && chatData.getChat) {
            if (chatData.getChat.messages) {
                setChatroom(chatData.getChat.messages);
            } else {
                // Set chatroom to default value (empty array) if no messages are returned
                setChatroom([]);
            }
            setRoomId(chatData.getChat._id);
        } else {
            // Set chatroom to default value (empty array) if chatData is null or undefined
            setChatroom([]);
        }
    }, [chatData]);


    // UseEffect used to scroll to the end of the chat when the chatroom messages or the room id changes
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatroom]);

    // UseEffect to stablish socket.io connection
    useEffect(() => {
        if (roomId) {
            // Connects to the server
            socket.current = io('https://tumorido-fittrack.onrender.com');

            // Joins the current room
            socket.current.emit('joinRoom', roomId);

            // Updates the chat to include the new message
            socket.current.on('message', (message) => {
                setChatroom(prevChatroom => [...prevChatroom, message]);
            });

            // Clean up on component unmount
            return () => {
                socket.current.disconnect();
            };
        }
    }, [roomId]);

    // Fucntion to handle the input change in the message form
    const handleInputChange = (e) => {
        setMessage(e.target.value);
    }

    // Function to handle sending messages
    const handleSendMessage = async (e) => {
        e.preventDefault();

        try {
            // Executes the mutation and returns the data
            const { data } = await sendMessage({
                variables: { content: message, receiver: receiver._id }
            })

            // Gets the new message from the data
            const newMessage = data?.sendMessage;

            // Emits the new message
            socket.current.emit('newMessage', { roomId, content: newMessage });

            // Clears the input
            setMessage('');
            console.log('Message sent:', newMessage);

        } catch (err) {
            console.log(err.message);
        }
    }

    // If no chat is selected render select chat message
    if (!receiver) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <h2>Select a chat</h2>
            </div>)
    }

    // If the chat is loading render loading message
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
                            key={msg.date}
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
                <div ref={chatEndRef} />
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