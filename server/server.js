// Imports the required modules
const path = require('path');
require('dotenv').config({ path: '../.env' });
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');

// Imports the databse conecction configuration
const db = require('./config/connection');

// Imports the GrapQL resolvers and definitions
const { typeDefs, resolvers } = require('./schemas');

// Initializes an express application 
const app = express();
const PORT = process.env.PORT || 3001;

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
        app.use(express.static(path.join(__dirname, '../client/dist')));
    }

    // Connects to the mongo database and starts the express server
    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
            console.log(`GraphQL available at http://localhost:${PORT}/graphql`);
        });
    });
};

// Start the Apollo Server and Express application
apolloServerStarter();