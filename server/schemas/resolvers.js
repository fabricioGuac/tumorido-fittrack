const { User, Body, Lift } = require('../models');
const { signToken, AuthError } = require('../utils/auth');
const dateScalar = require('./scalars');

const resolvers = {
    Date: dateScalar,
    Query: {
        // TODO: Remove the populate('lift')  if possible within the timeframe query it on a need basis instead
        me: async (parent, arg, context) => {
            if (context.user) {
                try {
                    const user = await User.findOne({ _id: context.user._id })
        .populate({ path: 'lift', options: { sort: { date: -1 } } })
        .populate({ path: 'body', options: { sort: { date: -1 } } }).lean();
                    
        user.lift = user.lift.map(lift => ({
            ...lift,
            totalWeightLifted: lift.sets.reduce((total, set) => total + (set.weight * set.reps), 0).toFixed(2)
        }))


        return user;
                } catch (err) {
                    return `NO GOOD ${err}`;
                }
            }
            throw AuthError;
        },

        // Query to make an query exercises by name to an api
        getExerciseByName: async (parent, { name }) => {

            // // Makes the api call
            // const response = await fetch(`https://api.api-ninjas.com/v1/exercises?name=${name}`, {
            //         method: 'GET',
            //         headers: {
            //             'X-Api-Key': process.env.EXERCISE_API_KEY,
            //             'Content-Type': 'application/json'
            //         }});
            // // returns the response data
            // return response.json();
            return [
                {
                    "name": "GET EXERCISE BY NAME1",
                    "type": "NAME",
                    "muscle": "GET EXERCISE BY NAME",
                    "equipment": "GET EXERCISE BY NAME",
                    "difficulty": "GET EXERCISE BY NAME",
                    "instructions": "PLACEHOLDER TO SEE IF BOTH QUERY RESULTS WILL RENDER AT THE SAME TIME."
                },
                {
                    "name": "GET EXERCISE BY NAME2",
                    "type": "NAME",
                    "muscle": "GET EXERCISE BY NAME",
                    "equipment": "GET EXERCISE BY NAME",
                    "difficulty": "GET EXERCISE BY NAME",
                    "instructions": "PLACEHOLDER TO SEE IF BOTH QUERY RESULTS WILL RENDER AT THE SAME TIME."
                },
                {
                    "name": "GET EXERCISE BY NAME3",
                    "type": "NAME",
                    "muscle": "GET EXERCISE BY NAME",
                    "equipment": "GET EXERCISE BY NAME",
                    "difficulty": "GET EXERCISE BY NAME",
                    "instructions": "PLACEHOLDER TO SEE IF BOTH QUERY RESULTS WILL RENDER AT THE SAME TIME."
                },
            ]


        },
        // Query to make an query exercises by muscle to an api
        getExerciseByMuscle: async (parent, { muscle },) => {

            //     // Makes the api call
            //     const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
            //         method: 'GET',
            //         headers: {
            //             'X-Api-Key': process.env.EXERCISE_API_KEY,
            //             'Content-Type': 'application/json'
            //         }});
            // // returns the response data
            // return response.json();

            return [
                {
                    "name": "GET EXERCISE BY MUSCLE1",
                    "type": "MUSCLE",
                    "muscle": "GET EXERCISE BY MUSCLE",
                    "equipment": "GET EXERCISE BY MUCLE",
                    "difficulty": "GET EXERCISE BY MUCLE",
                    "instructions": "PLACEHOLDER TO SEE IF BOTH QUERY RESULTS WILL RENDER AT THE SAME TIME."
                },
                {
                    "name": "GET EXERCISE BY MUSCLE2",
                    "type": "MUSCLE",
                    "muscle": "GET EXERCISE BY MUSCLE",
                    "equipment": "GET EXERCISE BY MUCLE",
                    "difficulty": "GET EXERCISE BY MUCLE",
                    "instructions": "PLACEHOLDER TO SEE IF BOTH QUERY RESULTS WILL RENDER AT THE SAME TIME."
                },
                {
                    "name": "GET EXERCISE BY MUSCLE3",
                    "type": "MUSCLE",
                    "muscle": "GET EXERCISE BY MUSCLE",
                    "equipment": "GET EXERCISE BY MUCLE",
                    "difficulty": "GET EXERCISE BY MUCLE",
                    "instructions": "PLACEHOLDER TO SEE IF BOTH QUERY RESULTS WILL RENDER AT THE SAME TIME."
                },
            ]

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
                    $addToSet: { lift: lift._id },
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