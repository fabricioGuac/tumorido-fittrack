

export default function LiftSetInput ({index, set, onChange, removeSet }){

    return (
        <>
            <label htmlFor={`reps${index}`} className="form-label">Reps</label>
            <input
                type="text"
                name="reps"
                id={`reps${index}`}
                value={set.reps}
                onChange={onChange}
                placeholder="Reps"
                className='form-control'
            />
            <label htmlFor={`weight${index}`} className="form-label">Weight</label>
            <input
                type="text"
                name="weight"
                id={`weight${index}`}
                value={set.weight}
                onChange={onChange}
                placeholder="Weight"
                className='form-control'
            />
            <button
                type="button"
                className='btn btn-danger mt-2'
                onClick={() => removeSet(index)}
            >
                Remove Set
            </button>
        </>
    );
}