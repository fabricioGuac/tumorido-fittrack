import { useState } from 'react';



export default function BodyFormRadio({ sex, measureUnit, massUnit, handleRadioChange }) {

    return (
        <>
            <div>
                <label>
                    <input
                        type="radio"
                        value="Male"
                        id='male'
                        name='sex'
                        checked={sex === 'Male'}
                        onChange={handleRadioChange}
                    />
                    Male
                </label>
                <label className='mx-2'>
                    <input
                        type="radio"
                        value="Female"
                        id='female'
                        name='sex'
                        checked={sex === 'Female'}
                        onChange={handleRadioChange}
                    />
                    Female
                </label>
            </div>
            <div>
                <label>
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
                <label className='mx-2'>
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
            <div>
                <label>
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
                <label className='mx-2'>
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
    )
}