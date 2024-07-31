import { useState } from "react";

import { useLazyQuery } from "@apollo/client";

import { GET_EXERCISE_BY_NAME, GET_EXERCISE_BY_MUSCLE } from '../utils/queries'

export default function Exercises() {
    // State to keep track of the active muscle
    const [activeMuscle, setActiveMuscle] = useState('');
    // State to handle the searchbar exercise
    const [exercise, setExercise] = useState('');

    // lazyQueries execute based on events
    const [getExercisesByMuscle, { loading, data }] = useLazyQuery(GET_EXERCISE_BY_MUSCLE);
    const [getExercisesByName, { loading: nameLoading, data: nameData }] = useLazyQuery(GET_EXERCISE_BY_NAME);


    const muscles = ['Chest', 'Quadriceps','Hamstrings', 'Back', 'Shoulders', 'Biceps', 'Triceps'];

    const buttonHandler = async (e) => {
        const { name } = e.target;
        try {
            setActiveMuscle(name)

            await getExercisesByMuscle({
                variables: { muscle: activeMuscle }
            })

            console.log(data);
            console.log(name);
        } catch (err) {
            console.log(err);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await getExercisesByName({
                variables: { name: exercise }
            })

            console.log(nameData);
            console.log(exercise);
        } catch (err) {
            console.log(err);
        }
    }

    if (loading || nameLoading) {
        return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <h2 className="text-primary">Loading...</h2>
        </div>)
    }

    return (
        <>
            <div className="container mt-4">
                <h1>Exercises</h1>
                <div className="d-flex justify-content-around align-items-center mb-3">
                    <div className="btn-group" role="group" aria-label="Target muscle">
                        {muscles.map(muscle => (
                            <button
                                key={muscle}
                                type="button"
                                name={muscle}
                                className={`btn ${activeMuscle === muscle ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={buttonHandler}
                            >
                                {muscle}
                            </button>
                        ))}
                    </div>
                    <div className="d-flex align-items-center me-3">
                        <form onSubmit={handleSubmit} className="d-flex flex-nowrap">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="exercise"
                                    value={exercise}
                                    onChange={(e) => setExercise(e.target.value)}
                                    placeholder="Type exercise name..."
                                />
                                <button className="btn btn-secondary" type="submit">
                                    <span role="img" aria-label="search" className="me-1">🔎</span>
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}