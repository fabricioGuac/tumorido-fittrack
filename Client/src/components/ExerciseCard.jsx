import { useState } from "react"

export default function ExerciseCard ({exercises}) {

    const [selected, setSelected] = useState('');

    const showExercise = (exercise) => {
        exercise === selected ? setSelected('') : setSelected(exercise);
    }

return (
    <>
    {exercises.map(exer => (
        <div key={exer.name} 
        className="card mb-3" 
        onClick={() => showExercise(exer.name)}
        aria-expanded={selected === exer.name}
        aria-controls={exer.name}> 
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-0" >{exer.name}</h2>
                            <h4 className="mb-0">Target muscle: {exer.muscle}</h4>
                        </div>
                        <button
                            className="btn btn-light btn-sm"
                            aria-label={selected === exer.name ? 'Collapse' : 'Expand'}
                        >
                            {selected === exer.name ? '−' : '+'}
                        </button>
                    </div>
            { selected === exer.name &&
            (<div className="card-body">
            <p className="card-text"><strong>Equipment:</strong> {exer.equipment}</p>
            <p className="card-text"><strong>Instructions:</strong> {exer.instructions}</p>
            </div>)
            }
        </div>))}
        </>
)
};


