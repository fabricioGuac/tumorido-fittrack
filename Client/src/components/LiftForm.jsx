import { useState } from 'react';

import LiftExerciseInput from './LiftExerciseInput';
import LiftSetInput from './LiftSetsInput';
import LiftUnitInput from './LiftUnitInput';

import { useMutation } from '@apollo/client';

import { GET_ME } from '../utils/queries';
import { ADD_LIFT } from '../utils/mutations';

export default function LiftForm({ liftOptions }) {
    // Set state variables
    const [exercise, setExercise] = useState('');
    const [sets, setSets] = useState([{ reps: '', weight: '' }]);
    const [units, setUnits] = useState('lbs');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(0)

    const [addLift, { error, loading }] = useMutation(ADD_LIFT, {
        refetchQueries: [
            { query: GET_ME }
        ],
    });

    const handleAddSet = () => {
        setSets([...sets, { reps: '', weight: '' }]);
    };

    const handleUnitChange = (e) => {
        setUnits(e.target.value);
    };

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;

        setSuccessMessage('');

        if (name === 'exercise') {
            setExercise(value);

            // If there is a value filter the options that include the value and get the options exercise name using map
            if (value && liftOptions) {
                const filteredSuggestions = liftOptions
                    .filter(lift => lift.exercise.toLowerCase().includes(value.toLowerCase()))
                    .map(lift => lift.exercise);
                setSuggestions(filteredSuggestions);
            } else {
                setSuggestions([]);
            }


        } else {
            // Updates the sets value
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


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!exercise) {
            setErrorMessage('Make sure to add the exercise name');
            return;
        }

        if (sets.some(set => set.reps === '' || set.weight === '')) {
            setErrorMessage('Make sure to fill all the data of your set');
            return;
        }

        const parsedSets = sets.map(set => ({
            reps: parseFloat(set.reps),
            weight: (lbsToKg(parseFloat(set.weight)))
        }))

        const formData = {
            exercise,
            sets: parsedSets
        }

        if (parsedSets.some(set => isNaN(set.reps) || isNaN(set.weight))) {
            setErrorMessage('Make sure the set data are numbers');
            return;
        }


        try {
            const { data } = await addLift({
                variables: formData
            })

            console.log(`${data.addLift.username} updated with the new lift:`);
            console.log(formData);

            setSets([{ reps: '', weight: '' }]);
            setExercise('');
            setErrorMessage('');
            setSuccessMessage('Lift added successfully!');
            
        } catch (err) {
            console.log(err.message);
            setErrorMessage(`An error has ocurred adding the lift ${err.message}`);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setExercise(suggestion);
        setSuggestions([]);
    }

    const handleSuggestNav = (e) => {
        if (e.key === 'ArrowDown') {
            setSelectedSuggestion(prevIndex => (prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0));
        } else if (e.key === 'ArrowUp') {
            setSelectedSuggestion(prevIndex => (prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1));
        } else if (e.key === 'Enter') {
            if (selectedSuggestion > -1) {
                e.preventDefault();
                handleSuggestionClick(suggestions[selectedSuggestion]);
            }
        }
    }

    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <LiftExerciseInput
                    exercise={exercise}
                    onChange={(e) => handleInputChange(null, e)}
                    onKeyDown={handleSuggestNav}
                    suggestions={suggestions}
                    onSuggestionClick={handleSuggestionClick}
                    selectedSuggestion={selectedSuggestion}
                />

                <LiftUnitInput
                    units={units}
                    onChange={handleUnitChange}
                />
                {sets.map((set, index) => (
                    <div key={index}>
                        <LiftSetInput
                            index={index}
                            set={set}
                            onChange={(e) => handleInputChange(index, e)}
                            removeSet={removeSet}
                        />
                    </div>
                ))}
                <div className='mt-2 '>
                    <button className='btn btn-primary' type="button" onClick={handleAddSet}>
                        Add Set
                    </button>
                    <button className='btn btn-primary mx-2' type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                        </button>
                </div>
            </form>
            {errorMessage && <div className='text-danger'><h4>{errorMessage}</h4></div>}
            {successMessage && <div className='text-success'><h4>{successMessage}</h4></div>}
        </div>
    );
}