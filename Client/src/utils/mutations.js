import {gql} from '@apollo/client';


export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!){
    login(email: $email, password: $password){
        token
        user{
            _id
            username
            }
        }
    }
`;

export const ADD_USER = gql`
    mutation createUser($username: String!, $email: String!, $password: String!){
    createUser(username: $username, email: $email, password: $password){
    token
    user{
        _id
        username
        }
    }
}
`;


export const ADD_BODY = gql`
    mutation addBody($weight: Float!, $bodyFatPercentage: Float!, $height: Int!){
    addBody(weight: $weight, bodyFatPercentage: $bodyFatPercentage , height: $height ){
        username
        body
    }
}
`

export const ADD_LIFT = gql`
    mutation addLift($exercise: String!, $sets: [SetInput!]!){
        addLift(exercise: $exercise, sets: $sets){
            username
            lift 
        }
    }
`;