const {User} = require('../models');
const {signToken, AuthError} = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, arg, context) => {
            console.log(context.user)
            return `PLACEHOLDER`;
        }
    },

    Mutation : {
        // Mutation to create a new user
        createUser: async (parent, {username, email, password}, context) => {
                // Creates a new user
                const user = await User.create({ username, email, password });
        
                // Creates a jwt token for the new user
                const token = signToken(user);
        
                // Returns the token and new user object
                return { token, user };
        },
        // Mutation to log an user in
        login: async (parent, {email, password}) => {
                // Searches for an user under the passed email 
                const user = await User.findOne({email});

                // If the user is not found throw an authentication error
                if(!user){
                    throw AuthError;
                }

                // Compares the passwords
                const correctPW = await user.isCorrectPassword(password);

                // If the passwords do not match throw an authentication error
                if(!correctPW){
                    throw AuthError;
                }

                // Creates a jwt for the user
                const token = signToken(user);

                // Returns the token and the logged user object
                return {token, user}
        }
    }
}

module.exports = resolvers;