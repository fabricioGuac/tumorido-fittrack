


export default function BodyFormRadio({ measureUnit, massUnit, handleRadioChange }) {

    return (
        <>

            <div className='radio-group'>
                <label >
                    <input
                        type="radio"
                        value="cm"
                        id='cm'
                        name='measureUnit'
                        checked={measureUnit === 'cm'}
                        onChange={handleRadioChange}
                    />
                    cm
                </label>
                <label >
                    <input
                        type="radio"
                        value="in"
                        id='in'
                        name='measureUnit'
                        checked={measureUnit === 'in'}
                        onChange={handleRadioChange}
                    />
                    in
                </label>
            </div>
            <div className='radio-group'>
                <label >
                    <input
                        type="radio"
                        value="lbs"
                        id='lbs'
                        name='massUnit'
                        checked={massUnit === 'lbs'}
                        onChange={handleRadioChange}
                    />
                    lbs
                </label>
                <label >
                    <input
                        type="radio"
                        value="kg"
                        id='kg'
                        name='massUnit'
                        checked={massUnit === 'kg'}
                        onChange={handleRadioChange}
                    />
                    kg
                </label>
            </div>
        </>
    );
}