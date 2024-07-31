
const typeDefs = `
scalar Date

input SetInput {
    reps: Float!
    weight: Float!
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
    body: [ID]
    lift: [ID]
    }


type Auth {
    token: ID!
    user: User
}

type Query {
    me: User
}

type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    
    addBody(weight:Float!, bodyFatPercentage: Float!, height: Int!): User
    addLift(exercise: String!, sets: [SetInput!]!): User
}

`


module.exports = typeDefs;