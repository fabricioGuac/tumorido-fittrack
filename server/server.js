// Imports the required modules
const path = require('path');
const http = require('http');
require('dotenv').config({ path: '../.env' });
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');

// Imports the databse connection configuration
const db = require('./config/connection');

// Imports the socket connection configuration
const socketConnect = require('./config/socket');

// Imports the GrapQL resolvers and definitions
const { typeDefs, resolvers } = require('./schemas');

// Initializes an express application 
const app = express();
const PORT = process.env.PORT || 3001;

// const WS_PORT = process.env.WS_PORT || 5000;

// Creates an http server using the express instance
const socketServer = http.createServer(app);

// Initializes a socket.io server instance with the HTTP server
const io = socketConnect(socketServer);


// Creates a new Apollo Server instance with the specified type definitions and resolvers
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Function to start the apollo server and set the middleware up
const apolloServerStarter = async () => {
    // Starts the apollo server
    await server.start();

    // Middleware to parse the url encoded or json  requests
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Integrates apollo server with express
    app.use('/graphql', expressMiddleware(server, {
        // Custom context for authentication
        context:authMiddleware,
    }));

    // Sets client/build as static assets in production
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../Client/dist')));

        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../Client/dist/index.html'));
        });
    }

    // Connects to the mongo database and starts the express server
    db.once('open', () => {
        socketServer.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
            console.log(`GraphQL available at http://localhost:${PORT}/graphql`);
            console.log(`WEBSOCKET LISTENING ON ${PORT}`);
        });
    });
};

// Start the Apollo Server and Express application
apolloServerStarter();