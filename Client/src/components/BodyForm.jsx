import { useState } from 'react';
import BodyFormRadio from './BodyFormRadio';

import { useMutation } from '@apollo/client';

import { ADD_BODY } from '../utils/mutations';


export default function BodyForm() {

    // State variables
    const [radios, setRadios] = useState({ sex: 'Male', measureUnit: 'cm', massUnit: 'kg' })
    const [form, setForm] = useState({ height: '', weight: '', neck: '', abdomen: '', waist: '' });
    const [errorMessage, setErrorMessage] = useState('');

    // Mutation to add body metrics
    const [addBody, {error}] = useMutation(ADD_BODY);



    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        })
    }

    const handleRadioChange = (e) => {
        const { name, value } = e.target;

        setRadios({
            ...radios,
            [name]: value
        })
    }

    // Converter functions to parse the imperial system to metric
    function heightToCm(height) {
        if (radios.measureUnit === 'cm') {
            return parseFloat(height);
        }

        // Splits the input by anything but a number
        const parts = height.split(/\D+/);


        // Initializes feet and inches
        let feet = 0;
        let inches = 0;

        // Determine feet and inches
        if (parts.length === 1) {
            // If only one part assumes it's all feets if it looks like a single number
            return (parseFloat(parts[0]) * 30.48);
        } else {
            feet = parseFloat(parts[0]);
            inches = parseFloat(parts[1]);
        }

        // Converts feets and inches to centimeters
        const totalInches = (feet * 12) + inches;
        const heightInCm = totalInches * 2.54;

        return heightInCm;
    }


    const inToCm = (measurement) => {
        return radios.measureUnit === 'in' ? measurement * 2.54 : measurement;
    }

    const lbsToKg = (weight) => {
        return radios.massUnit === 'lbs' ? weight * 0.453592 : weight;
    };

    const bfpCalc = (abdomen, neck, height, waist, sex) => {
        let bfPercentage = 0;
    
        if (sex === 'Male') {
            bfPercentage = 495 / (1.0324 - 0.19077 * Math.log10(abdomen - neck) + 0.15456 * Math.log10(height)) - 450;
        } else {
            bfPercentage = 495 / (1.29579 - 0.35004 * Math.log10(abdomen + waist - neck) + 0.22100 * Math.log10(height)) - 450;
        }
    
        return parseFloat(bfPercentage.toFixed(2));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cmHeight = heightToCm(form.height);
        const kgWeight = lbsToKg(parseFloat(form.weight));
        const cmNeck = inToCm(parseFloat(form.neck));
        const cmAbs = inToCm(parseFloat(form.abdomen));
        const cmWaist = form.waist ? inToCm(parseFloat(form.waist)) : 0;

        console.log(`Height: ${cmHeight}cm  Weight: ${kgWeight}kg  Neck: ${cmNeck}cm Abdomen: ${cmAbs}cm  Waist: ${cmWaist}cm`);

        // Conditional to ensure all the input data are numbers
        if(isNaN(cmHeight) || isNaN(cmAbs) || isNaN(kgWeight) || isNaN(cmNeck) || isNaN(cmWaist)){
            setErrorMessage('Please make sure the input data are numbers');
            return;
        }

        // Conditionals to ensure the fields are completed
        if(!form.height){
            setErrorMessage('Please make sure to fill your height');
        }
        if(!form.weight){
            setErrorMessage('Please make sure to fill your weight');
        }
        if(!form.neck){
            setErrorMessage('Please make sure to fill your neck measurements');
        }
        if(!form.abdomen){
            setErrorMessage('Please make sure to fill your abdominal measurements');
        }
        if(radios.sex === 'Female' && !form.waist){
            setErrorMessage('Please make sure to fill your waist measurements');
        }
        

        // Ensures that the values are valid for the formula
        if (cmAbs <= cmNeck || cmHeight <= 0 || (cmWaist < 0 && radios.sex === 'Female')) {
            // Show the error message
            setErrorMessage('Invalid input');
            return;
        }

        const BFP = bfpCalc(cmAbs, cmNeck, cmHeight, cmWaist);

        console.log(`BODY FAT PERCENTAGE ${BFP}%`);

        try {
            const { data } = await addBody({
                variables: { weight:kgWeight, bodyFatPercentage:BFP, height: cmHeight}
            })

            console.log(data.addBody.body);

            console.log('Submited');
            // Empties the form after a successfull submision
            setForm({ height: '', weight: '', neck: '', abdomen: '', waist: '' });
            setErrorMessage('');
        } catch (err) {
            console.log(err);
            setErrorMessage(err.message);
        }
    }

    return (
        <>
            <BodyFormRadio
                sex={radios.sex}
                measureUnit={radios.measureUnit}
                massUnit={radios.massUnit}
                handleRadioChange={handleRadioChange}
            />
            <div className='container'>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="height" className="form-label">Height</label>
                    <input
                        type='text'
                        name='height'
                        id='height'
                        value={form.height}
                        onChange={handleInputChange}
                        placeholder='Height'
                        className='form-control'
                    />
                    <label htmlFor="weight" className="form-label">Weight</label>
                    <input
                        type='text'
                        name='weight'
                        id='weight'
                        value={form.weight}

                        onChange={handleInputChange}
                        placeholder='Weight'
                        className='form-control'
                    />

                    <label htmlFor="neck" className="form-label">Neck measurements</label>
                    <input
                        type='text'
                        name='neck'
                        id='neck'
                        value={form.neck}

                        onChange={handleInputChange}
                        placeholder='Neck measurement'
                        className='form-control'
                    />

                    <label htmlFor="abdomen" className="form-label">Abdoment measurements</label>
                    <input
                        type='text'
                        name='abdomen'
                        id='abdomen'
                        value={form.abdomen}

                        onChange={handleInputChange}
                        placeholder='Abdomen'
                        className='form-control'
                    />
                    {radios.sex === 'Female' &&
                        <>
                            <label htmlFor="waist" className="form-label">Waist measurements</label>
                            <input
                                type='text'
                                name='waist'
                                id='waist'
                                value={form.waist}

                                onChange={handleInputChange}
                                placeholder='waist'
                                className='form-control'
                            /> </>}
                    <button className='btn btn-primary mx-2' type="submit">Submit</button>
                </form>
                {errorMessage && <div className='text-danger'>{errorMessage}</div>}
            </div>
        </>
    )

}