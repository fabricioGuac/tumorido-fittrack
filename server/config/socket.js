// Import the server class from socket.io to create a new socket server instance
const {Server} = require('socket.io');

// Function to handle the socket connection and configuration
const socketConnect = (server) => {

    // Creates a new instances of the socket server passing and http server instance
    const io = new Server(server, {
        // Allows requests from the front end of the project
        cors: {
            origin: 'http://localhost:3000',
            methods: ["GET", "POST"]
        }
    });

    // Registers an event listener for user connections
    io.on('connection', (socket) => {
        console.log(`User connected  ${socket.id}` );

        // Registers an event listener for joinRoom events
        socket.on('joinRoom', (roomId) => {
            // Adds the user to the to the specified room
            socket.join(roomId);

            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        // Registers an event listener for newMessage events
        socket.on("newMessage", (message) => {
            // Deconstructs the message in the roomId and the content
            const {roomId, content} = message;
            // Sends the contents of the message to the specified room
            io.to(roomId).emit("message", content);

            console.log(`Message sent to room ${roomId}: ${content}`);
        });

        // Registers an event listener for user disconnections
        socket.on('disconnect', () => {
            console.log(`User ${socket.id} disconnected`);
        });
    });

    // Returns the instance of the socket server
    return io;
}

module.exports = socketConnect;