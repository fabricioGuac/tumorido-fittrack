import { useState, useEffect } from "react";

import ExerciseCard from '../components/ExerciseCard'

import { useLazyQuery } from "@apollo/client";

import { GET_EXERCISE_BY_NAME, GET_EXERCISE_BY_MUSCLE } from '../utils/queries'

export default function Exercises() {
    // State to keep track of the active muscle
    const [activeMuscle, setActiveMuscle] = useState('Chest');
    // State to handle the searchbar exercise
    const [exercise, setExercise] = useState('');
    // State to keep track of the active query
    const [activeQuery, setActiveQuery] = useState('muscle')

    // lazyQueries execute based on events
    const [getExercisesByMuscle, { loading, data }] = useLazyQuery(GET_EXERCISE_BY_MUSCLE);
    const [getExercisesByName, { loading: nameLoading, data: nameData }] = useLazyQuery(GET_EXERCISE_BY_NAME);


    const muscles = ['Chest', 'Quadriceps', 'Hamstrings', 'Back', 'Shoulders', 'Biceps', 'Triceps'];

    // When activeMucle state changes perform the query
    useEffect(() => {
        const fetchData = async () => {
            try {
                await getExercisesByMuscle({
                    variables: { muscle: activeMuscle }
                });
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [activeMuscle]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await getExercisesByName({
                variables: { name: exercise }
            })

            setActiveQuery('name');
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
                                onClick={() => {
                                    setActiveMuscle(muscle);
                                    setActiveQuery('muscle');
                                }}
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
            {activeQuery === 'muscle' && data?.getExerciseByMuscle && (
                <ExerciseCard exercises={data.getExerciseByMuscle} />
            )}
            {activeQuery === 'name' && nameData?.getExerciseByName && (
                <ExerciseCard exercises={nameData.getExerciseByName} />
            )}
            </div>
            
        </>
    );
}