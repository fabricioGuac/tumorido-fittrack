import { gql } from '@apollo/client';


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
    }
}
`;

export const ADD_LIFT = gql`
    mutation addLift($exercise: String!, $sets: [SetInput!]!){
        addLift(exercise: $exercise, sets: $sets){
            username
        }
    }
`;

export const SEND_PRESIGNED_URL = gql`
    mutation sendPreSignedUrl($filename: String!, $contentType: String!){
        sendPreSignedUrl(filename: $filename, contentType: $contentType)
    }
`;

export const SET_USER_PFP = gql`
    mutation setUserPfp($url: String!){
        setUserPfp(url: $url)
    }
`
    ;

export const SEND_MESSAGE = gql`
    mutation sendMessage($content: String!, $receiver: ID!){
        sendMessage(content: $content, receiver: $receiver){
                content
                date
                sender
                receiver
        }
    }
`;

export const CREATE_ROOM = gql`
    mutation createChatroom($name: String!){
        createChatroom(name: $name){
            name
            members
        }
    }
`;

export const JOIN_ROOM = gql`
    mutation joinChatroom($chatroom: ID!) {
        joinChatroom(chatroom: $chatroom){
            name
            members
        }
    }

`;