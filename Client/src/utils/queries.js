import { gql } from '@apollo/client';

export const GET_ME = gql`
query me {
    me {
        _id
        username
        email
        height
        pfp
        lift {
            _id
            exercise
            date
            totalWeightLifted
            sets {
                reps
                weight
            }
        }
        body {
            date
            bodyFatPercentage
            weight
        }
    }
}

`;

export const GET_EXERCISE_BY_NAME = gql`
    query getExerciseByName($name: String!) {
            getExerciseByName(name: $name){
                name
                muscle
                instructions
                equipment
                }
}
`;


export const GET_EXERCISE_BY_MUSCLE = gql`
    query getExerciseByMuscle($muscle: String!) {
        getExerciseByMuscle(muscle: $muscle) {
            name
            muscle
            instructions
            equipment
        }
    }
`;

export const GET_CHAT = gql`
    query getChat($userId: ID!) {
        getChat(userId: $userId) {
            _id
            content
            date
            sender 
            receiver 
        }
    }
`;

export const GET_USER_CHATS = gql`
    query getUserChats {
        getUserChats {
        id 
        members {
            username
            pfp
            }
        }
    }
`;

export const GET_CHAT_OPTIONS = gql`
    query getChatOptions {
        getChatOptions {
            _id
            username
            pfp
        }
    }
`;


