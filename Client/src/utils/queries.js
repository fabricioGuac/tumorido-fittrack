import { gql } from '@apollo/client';

export const GET_ME = gql`
query me {
    me {
        _id
        username
        email
        height
        lift {
            _id
            exercise
            date
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