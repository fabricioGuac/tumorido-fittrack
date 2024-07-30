import React, { useState } from 'react';

import { useMutation } from '@apollo/client';

export default function LiftForm() {
    const [exercise, setExercise] = useState('');
    const [sets, setSets] = useState([{ reps: '', weight: '' }]);
    const [units, setUnits] = useState('lbs');
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddSet = () => {
        setSets([...sets, { reps: '', weight: '' }]);
    };

    const handleUnitChange = (e) => {
        setUnits(e.target.value);
    };

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
    
        if (name === 'exercise') {
            setExercise(value); 
        } else {

            const newSets = [...sets];
            newSets[index][name] = value;
            setSets(newSets);
        }
    };

    const lbsToKg = (weight) => {
        return units === 'lbs' ? weight * 0.453592 : weight; 
    };

    const removeSet = (index) => {
        const newSets = sets.filter((_, i) => i !== index);
        setSets(newSets);
    }


    const handleSubmit = (event) => {
        event.preventDefault();

        if(!exercise){
            setErrorMessage('Make sure to add the exercise name');
            return;
        }

        if(sets.some(set => set.reps === '' || set.weight === '')){
            setErrorMessage('Make sure to fill all the data of your set');
            return;
        }

        const parsedSets = sets.map( set => ({
            reps: parseFloat(set.reps),
            weight: (lbsToKg(parseFloat(set.weight)))
        }))

        const formData = {
            exercise,
            sets: parsedSets
        }

        if(parsedSets.some(set => isNaN(set.reps) || isNaN(set.weight))){
            setErrorMessage('Make sure the set data are numbers');
            return;
        }


        setSets([{ reps: '', weight: '' }]);
        setExercise('');
        setErrorMessage('');

        // Use addLift mutation
        console.log(formData);
    };

    return (
        <div className='container'> 
        <form onSubmit={handleSubmit}>
            <div>
            <label htmlFor="exercise" className="form-label">Exercise name</label>
                <input 
                    type='text'
                    name='exercise'
                    id='exercise'
                    value={exercise}
                    onChange={(e) => handleInputChange(null, e)}
                    placeholder='Exercise'
                    className='form-control'
                />
            </div>
            <div>
                <label>
                    <input
                        type="radio"
                        value="lbs"
                        id='lbs'
                        checked={units === 'lbs'}
                        onChange={handleUnitChange}
                    />
                    lbs
                </label>
                <label className='mx-2'>
                    <input
                        type="radio"
                        value="kg"
                        id='kg'
                        checked={units === 'kg'}
                        onChange={handleUnitChange}
                    />
                    kg
                </label>
            </div>
            {sets.map((set, index) => (
                <div key={index}>
            <label htmlFor={`reps${index}`} className="form-label">Reps</label>
                    <input
                        type="text"
                        name="reps"
                        id={`reps${index}`}
                        value={set.reps}
                        onChange={(e) => handleInputChange(index, e)}
                        placeholder="Reps"
                        className='form-control'
                        
                    />
            <label htmlFor={`weight${index}`} className="form-label">Weight</label>
                    <input
                        type="text"
                        name="weight"
                        id={`weight${index}`}
                        value={set.weight}
                        onChange={(e) => handleInputChange(index, e)}
                        placeholder="Weight"
                        className='form-control'
                    />
                    <button
                            type="button"
                            className='btn btn-danger'
                            onClick={() => removeSet(index)}
                        >
                            Remove Set
                        </button>
                </div>
            ))}
            <div className='mt-2 '>
            <button className='btn btn-primary' type="button" onClick={handleAddSet}>
                Add Set
            </button>
            <button className='btn btn-primary mx-2' type="submit">Submit</button>
            </div>
        </form>
        {errorMessage && <div className='text-danger'>{errorMessage}</div>}
        </div>
    );
}