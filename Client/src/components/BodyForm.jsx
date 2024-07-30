import { useState } from 'react';
import BodyFormRadio from './BodyFormRadio';

import { useMutation } from '@apollo/client';

import { ADD_BODY } from '../utils/mutations';


export default function BodyForm() {
    // weight
    // height
    // bf% navy calc *measurements *sexbox
    //     For men, it looks like this:

    // For men, all measurements in inches:
    // %Fat = 86.010*LOG(abdomen - neck) - 70.041*LOG(height) + 36.76

    // For men, all measurements in centimeters:
    // %Fat = 86.010*LOG(abdomen - neck) - 70.041*LOG(height) + 30.30

    // For women, all measurements in inches:
    // %Fat = 163.205*LOG(abdomen + hip - neck) - 97.684*LOG(height) - 78.387

    // For women, all measurements in centimeters:
    // %Fat = 163.205*LOG(abdomen + hip - neck) - 97.684*LOG(height) - 104.912

    const [radios, setRadios] = useState({ sex: 'Male', measureUnit: 'cm', massUnit: 'kg' })

    const handleRadioChange = (e) => {
        const { name, value } = e.target;

        setRadios({
            ...radios,
            [name]: value
        })
    }

    const inToCm = (measurement) => {
        return radios.measureUnit === 'in' ? measurement * 2.54 : measurement;
    }

    const lbsToKg = (weight) => {
        return radios.massUnit === 'lbs' ? weight * 0.453592 : weight; 
    };

    const bfpCalc = (abdomen, neck, height, hip) => {
        return radios.sex === 'Male' ?  86.010*Math.log(abdomen - neck) - 70.041*Math.log(height) + 30.30 : 163.205*Math.log(abdomen + hip - neck) - 97.684*Math.log(height) - 104.912
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submited');
    }

    return (
        <>
            <BodyFormRadio
                sex={radios.sex}
                measureUnit={radios.measureUnit}
                massUnit={radios.massUnit}
                handleRadioChange={handleRadioChange}
            />
            <div className='conatiner'>
                <form onSubmit={handleSubmit}>

                <button className='btn btn-primary mx-2' type="submit">Submit</button>
                </form>
            </div>
        </>
    )

}