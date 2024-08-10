
const typeDefs = `
scalar Date

input SetInput {
    reps: Float!
    weight: Float!
}

type Message {
    _id: ID!
    content: String!
    date: Date!
    sender: ID!
    receiver: ID
    chatroom: ID
}

type Chatroom {
    _id: ID
    name: String
    members: [ID]
}



type Exercise {
    name: String
    type: String
    muscle: String
    equipment: String
    difficulty: String
    instructions: String
}

type Set {
    reps: Float!
    weight: Float!
}

type Lift {
    _id: ID!
    exercise: String!
    date: Date!
    sets: [Set!]!
    totalWeightLifted: Float!
}


type Body {
    _id: ID!
    date: Date!
    weight: Float
    bodyFatPercentage: Float!
}

type User {
    _id: ID!
    username: String!
    email:String!
    body: [Body]
    lift: [Lift]
    height: Float
    pfp: String
    }

type ChatOptions {
    users: [User]
    chatrooms: [Chatroom]
}

type Auth {
    token: ID!
    user: User
}

type Query {
    me: User
    getExerciseByName(name:String!): [Exercise]
    getExerciseByMuscle(muscle:String!): [Exercise]

    getChat(userId: ID!): [Message]
    getChatroomMessages(chatroomId: ID!):[Message]
    getChatOptions:[ChatOptions]
}

type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    
    addBody(weight:Float!, bodyFatPercentage: Float!, height: Int!): User
    addLift(exercise: String!, sets: [SetInput!]!): User

    sendPreSignedUrl(filename: String!, contentType: String!): String
    setUserPfp(url: String!): Boolean

    sendMessage(content: String!, receiver: ID, chatroom: ID): Message
    createChatroom(name: String!): Chatroom
    joinChatroom(chatroom: ID!): Chatroom
}

`


module.exports = typeDefs;