

export default function LiftExerciseInput ({ exercise, onChange, onKeyDown, suggestions, onSuggestionClick, selectedSuggestion }) {
    

    return (
        <div>
            <label htmlFor="exercise" className="form-label">Exercise name</label>
            <input 
                type='text'
                name='exercise'
                id='exercise'
                value={exercise}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder='Exercise'
                className='form-control'
            />
            {suggestions.length > 0 && (
                <ul className="list-group mt-2">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className={`list-group-item list-group-item-action ${index === selectedSuggestion ? 'active' : ''}`}
                            onClick={() => onSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}