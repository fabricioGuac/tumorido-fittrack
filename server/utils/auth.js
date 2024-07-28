// Imports the error from GraphQL and jwt dependency
const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

// Gets the secret from the enviromental variables and defines the expiration of the jwt
const secret = process.env.SECRET;
const expiration = "2h";

// 
module.exports = {
    // Creates a new GraphQL error for autentication issues
    AuthError: new GraphQLError('Could not authenticate user.', {
        extensions: {
            code: 'UNAUTHENTICATED',
        },
    }),

    // Middelware to authenticate users
    authMiddleware: function ({ req }) {
        // allows token to be sent via req.body, req.query, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        // If the token is in the header remove the 'Bearer' prefix
        if (req.headers.authorization) {
            token = token.split(' ').pop().trim();
        }

        // If no token is found return the unathenticated request
        if (!token) {
            return req;
        }

        // Verify the token
        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            // Add the user data to the request
            req.user = data;
        } catch {
            console.log('Invalid token');
        }

        // Return the authenticated request
        return req;
    },

    signToken: function ({ email, username, _id }) {
        const payload = { email, username, _id };
        // Sign the payload with the secret key and set an expiration time for the token
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
}