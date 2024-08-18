const { User, Body, Lift, Message, Chatroom } = require('../models');
const { signToken, AuthError } = require('../utils/auth');
const s3 = require('../config/awsConfig');

const dateScalar = require('./scalars');
const { $where } = require('../models/Lift');


const resolvers = {
    Date: dateScalar,
    Query: {
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

            // Makes the api call
            const response = await fetch(`https://api.api-ninjas.com/v1/exercises?name=${name}`, {
                method: 'GET',
                headers: {
                    'X-Api-Key': process.env.EXERCISE_API_KEY,
                    'Content-Type': 'application/json'
                }
            });
            // returns the response data
            return response.json();



        },
        // Query to make an query exercises by muscle to an api
        getExerciseByMuscle: async (parent, { muscle },) => {

            // Makes the api call
            const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
                method: 'GET',
                headers: {
                    'X-Api-Key': process.env.EXERCISE_API_KEY,
                    'Content-Type': 'application/json'
                }
            });
            // returns the response data
            return response.json();

        },

        // Query to get the chat between to users
        getChat: async (parent, { userId }, context) => {
            if (!context.user) {
                throw AuthError;
            }
            const currentUserId = context.user._id;

            try {
                const chat = await Chatroom.findOne({ members: { $all: [userId, currentUserId] } }).populate('messages').lean();

                // If the chat does not exist it creates a new chatroom
                if (!chat) {
                    return await Chatroom.create({
                        members: [userId, currentUserId],
                    });
                }

                return chat;

            } catch (err) {
                console.log(err);
                throw new Error("Error reading the chat" + err.message);
            }
        },


        // Query to get the options to chat with
        getChatOptions: async (parent, args, context) => {
            if (!context.user) {
                throw AuthError;
            }

            const userOptions = await User.find({ _id: { $ne: context.user._id } });


            return userOptions;
        },

        // Query to get the chats of the user
        getUserChats: async (parent, args, context) => {
            if (!context.user) {
                throw AuthError;
            }

            const currentUserId = context.user._id;

            const userChats = await Chatroom.find({ members: currentUserId })
                .sort({ updatedAt: -1 })
                .populate('members', 'username pfp');




            return userChats;
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
        },

        // Generates and returns a presigned URL for uploading an object to the S3 bucket
        sendPreSignedUrl: async (parent, { filename, contentType }, context) => {
            if (context.user) {
                // Defines the parameters such as bucket name, key under wich the object will be stored, url expiration in seconds and mimetype of the file
                const params = {
                    Bucket: 'tumorido',
                    Key: `pfp/${filename}`,
                    Expires: 60,
                    ContentType: contentType
                };

                try {
                    // Generates a presigned URL for uploading an object to the specified bucket
                    return await s3.getSignedUrlPromise('putObject', params);
                } catch (err) {
                    console.log(err)
                    throw new Error('Error generating presigned URL');
                }
            }

            throw AuthError;
        },
        // Updates the user profile picture
        setUserPfp: async (parent, { url }, context) => {
            if (context.user) {
                try {
                    // Updates the user pfp tp the new one and returns the object before the update
                    const user = await User.findByIdAndUpdate(context.user._id, { $set: { pfp: url } });

                    // If the user had a previous profile picture deletes it from the s3 bucket
                    if (user.pfp) {
                        // Gets the object ey from the image URL
                        const key = user.pfp.split('/').slice(-1)[0];
                        // Sets the params for the s3 deletion
                        const delParams = { Bucket: 'tumorido', Key: `pfp/${key}` }
                        // Makes a request to the s3 bucket to delete the object
                        await s3.deleteObject(delParams).promise();

                    }

                    // If the operation secceeds returns true
                    return true;

                } catch (err) {
                    console.log(err);
                    throw new Error('Error updating the profile picture')
                }
            }
            throw AuthError;
        },

        // Mutation to send messages
        sendMessage: async (parent, { content, receiver }, context) => {
            if (!context.user) {
                throw AuthError;
            }

            const sender = context.user._id;

            try {

                // Creates the new messsage
                const newMessage = await Message.create({
                    content,
                    sender,
                    receiver,
                });

                // Updates the chatroom to containe the new message
                const chatroom = await Chatroom.findOneAndUpdate({
                    members: { $all: [sender, receiver] },
                },
                    { $addToSet: { messages: newMessage._id } },
                    { runValidators: true, new: true },
                )


                return newMessage;
            } catch (err) {
                throw new Error('Error sending message: ' + err.message);
            }
        },

        // Mutation to create a chatroom
        createChatroom: async (parent, { name }, context) => {
            if (!context.user) {
                throw AuthError;
            }
            try {
                const newChatroom = await Chatroom.create({
                    name,
                    // Uses an array to start with one member
                    members: [context.user._id],
                });

                return newChatroom;
            } catch (err) {
                throw new Error('Error creating chatroom: ' + err.message);
            }
        },

        joinChatroom: async (parent, { chatroom }, context) => {
            if (!context.user) {
                throw AuthError;
            }
            try {
                const updatedChatroom = await Chatroom.findByIdAndUpdate(
                    chatroom,
                    // Adds the user to the members array
                    { $addToSet: { members: context.user._id } },
                    { new: true }
                );

                if (!updatedChatroom) {
                    throw new Error('Chatroom not found');
                }

                return updatedChatroom;
            } catch (err) {
                throw new Error('Error joining chatroom: ' + err.message);
            }
        }
    }
}

module.exports = resolvers;