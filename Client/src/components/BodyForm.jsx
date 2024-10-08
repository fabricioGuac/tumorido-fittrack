import { useState } from 'react';
import BodyFormRadio from './BodyFormRadio';

import { useMutation } from '@apollo/client';

import { ADD_BODY } from '../utils/mutations';
import { GET_ME } from '../utils/queries';


export default function BodyForm({setView, isFemale, height}) {

    // State variables
    const [radios, setRadios] = useState({measureUnit: 'cm', massUnit: 'kg' })
    const [form, setForm] = useState({weight: '', neck: '', abdomen: '', waist: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    // Mutation to add body metrics
    const [addBody, { error, loading }] = useMutation(ADD_BODY, {
        refetchQueries: [
            { query: GET_ME }
        ],
    });



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



    const inToCm = (measurement) => {
        return radios.measureUnit === 'in' ? measurement * 2.54 : measurement;
    }

    const lbsToKg = (weight) => {
        return radios.massUnit === 'lbs' ? weight * 0.453592 : weight;
    };

    const bfpCalc = (abdomen, neck, height, waist) => {
        let bfPercentage = 0;
    
        if (isFemale) {
            bfPercentage = 495 / (1.29579 - 0.35004 * Math.log10(abdomen + waist - neck) + 0.22100 * Math.log10(height)) - 450;
        } else {
            bfPercentage = 495 / (1.0324 - 0.19077 * Math.log10(abdomen - neck) + 0.15456 * Math.log10(height)) - 450;
        }
    
        return parseFloat(bfPercentage.toFixed(2));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // const cmHeight = heightToCm(form.height);
        const kgWeight = lbsToKg(parseFloat(form.weight));
        const cmNeck = inToCm(parseFloat(form.neck));
        const cmAbs = inToCm(parseFloat(form.abdomen));
        const cmWaist = form.waist ? inToCm(parseFloat(form.waist)) : 0;

        console.log(`Height: ${height}cm  Weight: ${kgWeight}kg  Neck: ${cmNeck}cm Abdomen: ${cmAbs}cm  Waist: ${cmWaist}cm`);

        // Conditional to ensure all the input data are numbers
        if(isNaN(cmAbs) || isNaN(kgWeight) || isNaN(cmNeck) || isNaN(cmWaist)){
            setErrorMessage('Please make sure the input data are numbers');
            return;
        }

        // Conditionals to ensure the fields are completed
        if(!form.weight){
            setErrorMessage('Please make sure to fill your weight');
        }
        if(!form.neck){
            setErrorMessage('Please make sure to fill your neck measurements');
        }
        if(!form.abdomen){
            setErrorMessage('Please make sure to fill your abdominal measurements');
        }
        if(isFemale === 1 && !form.waist){
            setErrorMessage('Please make sure to fill your waist measurements');
        }

        if(errorMessage){
            return;
        }
        

        // Ensures that the values are valid for the formula
        if (cmAbs <= cmNeck || height <= 0 || (cmWaist < 0 && isFemale)) {
            // Show the error message
            setErrorMessage('Invalid input');
            return;
        }

        const BFP = bfpCalc(cmAbs, cmNeck, height, cmWaist);

        console.log(`BODY FAT PERCENTAGE ${BFP}%`);

        try {
            const { data } = await addBody({
                variables: { weight:kgWeight, bodyFatPercentage:BFP}
            })

            console.log(data.addBody.body);

            console.log('Submited');
            // Empties the form after a successfull submision
            setForm({ weight: '', neck: '', abdomen: '', waist: '' });
            setErrorMessage('');
            setSuccessMessage('Body data added successfully!');
        } catch (err) {
            console.log(err);
            setErrorMessage(err.message);
        }
    }

    if (loading){
        return(
        <div className="d-flex justify-content-center align-items-center vh-100">
            <h2 className="text-primary">Loading...</h2>
        </div>)
    }

    return (
        <>
            <BodyFormRadio
                measureUnit={radios.measureUnit}
                massUnit={radios.massUnit}
                handleRadioChange={handleRadioChange}
            />
            <div className='container'>
                <form onSubmit={handleSubmit}>

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

                    <label htmlFor="abdomen" className="form-label">Abdomen measurements</label>
                    <input
                        type='text'
                        name='abdomen'
                        id='abdomen'
                        value={form.abdomen}

                        onChange={handleInputChange}
                        placeholder='Abdomen'
                        className='form-control'
                    />
                    {isFemale === 1 &&
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
                        <button className='btn btn-primary  mt-2' type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                        </button>
                </form>
                {errorMessage && <div className='text-danger'><h4>{errorMessage}</h4></div>}
                {successMessage && <div className='text-success'><h4>{successMessage}</h4></div>}
            </div>
        </>
    )

}