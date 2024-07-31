const { User, Body, Lift } = require('../models');
const { signToken, AuthError } = require('../utils/auth');
const  dateScalar  = require('./scalars');

const resolvers = {
    Date: dateScalar,
    Query: {
        me: async (parent, arg, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
                // .populate('body').populate('lift')
            }
            throw AuthError;
        },

        
        // Mutation to make an query exercises by name to an api
        getExerciseByName: async (parent, {name}) => {

            // Makes the api call
            const response = await fetch(`https://api.api-ninjas.com/v1/exercises?name=${name}`, {
                    method: 'GET',
                    headers: {
                        'X-Api-Key': process.env.EXERCISE_API_KEY,
                        'Content-Type': 'application/json'
                    }});
            // returns the response data
            return response.json()

        },
        // Mutation to make an query exercises by muscle to an api
        getExerciseByMuscle: async (parent, {muscle},) => {

            // Makes the api call
            const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
                method: 'GET',
                headers: {
                    'X-Api-Key': process.env.EXERCISE_API_KEY,
                    'Content-Type': 'application/json'
                }});
        // returns the response data
        return response.json()
        }
    },

    Mutation: {
        // Mutation to create a new user
        createUser: async (parent, { username, email, password }) => {
            // Creates a new user
            const user = await User.create({ username, email, password });

            // Creates a jwt token for the new user
            const token = signToken(user);

            // Returns the token and new user object
            return { token, user };
        },
        // Mutation to log an user in
        login: async (parent, { email, password }) => {
            // Searches for an user under the passed email 
            const user = await User.findOne({ email });

            // If the user is not found throw an authentication error
            if (!user) {
                throw AuthError;
            }

            // Compares the passwords
            const correctPW = await user.isCorrectPassword(password);

            // If the passwords do not match throw an authentication error
            if (!correctPW) {
                throw AuthError;
            }

            // Creates a jwt for the user
            const token = signToken(user);

            // Returns the token and the logged user object
            return { token, user }
        },
        // Mutation to introduce body data
        addBody: async (parent, { weight, bodyFatPercentage, height }, context) => {

            // If the context does not have an user object throws an autentication error
            if (!context.user) {
                throw AuthError
            }

            // Creates a new body with the input data
            const body = await Body.create({ userId: context.user._id, weight, bodyFatPercentage });

            // Updates the user 
            const user = await User.findOneAndUpdate({ _id: context.user._id },
                {
                    // Adds the id of the new body to the body ids array
                    $addToSet: { body: body._id },
                    // Updates the height
                    $set: { height: height },
                },
                { new: true, runValidators: true },
            );

            // If the user update fails throws an authentication error
            if (!user) {
                throw AuthError;
            }

            // Returns the modified user object
            return user;
        },
        // Mutation to introduce a lift data
        addLift: async (parent, { exercise, sets }, context) => {

            // If the context does not have an user object throws an autentication error
            if (!context.user) {
                throw AuthError
            }

            // Creates a new lift with the input data
            const lift = await Lift.create({ userId: context.user._id, exercise, sets });

            // Updates the user 
            const user = await User.findOneAndUpdate({ _id: context.user._id },
                {
                    // Adds the id of the new lift to the lift ids array
                    $addToSet: {lift: lift._id },
                },
                { new: true, runValidators: true },
            );

            // If the user update fails throws an authentication error
            if (!user) {
                throw AuthError;
            }

            // Returns the modifies user
            return user;
        }
    }
}

module.exports = resolvers;