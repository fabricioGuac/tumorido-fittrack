

export default function LiftUnitInput({units, onChange}){

    return (
        <div>
                <label>
                    <input
                        type="radio"
                        value="lbs"
                        id='lbs'
                        checked={units === 'lbs'}
                        onChange={onChange}
                    />
                    lbs
                </label>
                <label className='mx-2'>
                    <input
                        type="radio"
                        value="kg"
                        id='kg'
                        checked={units === 'kg'}
                        onChange={onChange}
                    />
                    kg
                </label>
            </div>
    );
}