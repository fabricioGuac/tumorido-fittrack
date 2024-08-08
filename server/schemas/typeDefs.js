
const typeDefs = `
scalar Date
scalar Upload

input SetInput {
    reps: Float!
    weight: Float!
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


type Auth {
    token: ID!
    user: User
}

type Query {
    me: User
    getExerciseByName(name:String!): [Exercise]
    getExerciseByMuscle(muscle:String!): [Exercise]
}

type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    
    addBody(weight:Float!, bodyFatPercentage: Float!, height: Int!): User
    addLift(exercise: String!, sets: [SetInput!]!): User

    sendPreSignedUrl(filename: String!, contentType: String!): String
    setUserPfp(url: String!): Boolean
}

`


module.exports = typeDefs;