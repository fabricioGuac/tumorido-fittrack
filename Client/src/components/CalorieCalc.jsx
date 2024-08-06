import { useState } from "react";

import FfmiScoreTable from "./FfmiScoreTable";

export default function CalorieCalc({ latestData, latestFFMI, height }) {

    // Sets the state vriables
    const [gender, setGender] = useState('Male');
    const [activityLevel, setActivityLevele] = useState('moderate');
    const [age, setAge] = useState(18);
    const [calMacCalcData, setcalMacCalcData] = useState(null);

    //Creates two objects to store the respective data based on the activity level
    const activityMultipliers = {
        'moderate': 1.55,
        'intense': 1.725,
        'high': 1.9
    }

    const proteinRanges = {
        'moderate': [1, 1.6],
        'intense': [1.6, 2],
        'high': [2, 2.2]

    }
    // Function to calculate the mantainance calories and the recomended macronutrients
    const CaloMacCalc = (e) => {
        e.preventDefault();


        // Calculates the basic metabolic rate
        const BMR = gender === 'Male' ? 66.47 + (13.75 * latestData.weight) + (5.003 * height) - (6.755 * age) : 655.1 + (9.563 * latestData.weight) + (1.850 * height) - (4.676 * age);

        // Multiply the basic metabolic rate by the respective activity multiplier to get the total daily energy expenditure
        const TDEE = BMR * activityMultipliers[activityLevel];

        // Gets the respective protein range for the activy level 
        const [proteinLow, proteinHigh] = proteinRanges[activityLevel];
        // Calculates the avarage recommended protein intake
        const avgRecProtIntake = Math.round(latestData.weight * ((proteinLow + proteinHigh) / 2));

        //Calculates the calories from protein
        const proteinCals = avgRecProtIntake * 4;

        // Calculates the remaining calories after the protein requirements
        const remainingCals = TDEE - proteinCals;

        // Sets 35% of the remaining calorie intake for fats
        const recomFatIntake = Math.round((remainingCals * 0.35) / 9);

        // Calories left after fats
        const remainingCalsForCarbs = remainingCals - (recomFatIntake * 9);
        // Convert calories to grams of carbs
        const recomCarbsIntake = Math.round(remainingCalsForCarbs / 4);

        // Recomended protein range
        const recomendedProteinRange = [Math.round(proteinLow * latestData.weight), Math.round(proteinHigh * latestData.weight)];

        console.log(`BASIC: ${Math.round(BMR)}, TOTAL: ${Math.round(TDEE)}, PROTEIN: ${avgRecProtIntake}, FATS: ${recomFatIntake}, CARBS: ${recomCarbsIntake}, RECOMENDED RANGE FOR PROTEIN:${recomendedProteinRange}`)

        setcalMacCalcData({
            BMR, TDEE, avgRecProtIntake, recomFatIntake, recomCarbsIntake, recomendedProteinRange
        })
    }

    return (
        <>
            <div className="body-data-container">
                <div className="latest-data-form">
                    <div className="latest-data">
                        <h1>Latest data</h1>
                        <p>Weight: {latestData.weight}kg</p>
                        <p>Body fat percentage: {latestData.bodyFatPercentage}%</p>
                        <p>FFMI: {latestFFMI}</p>
                        <p>Height: {height}cm</p>
                    </div>

                    <form onSubmit={CaloMacCalc} className="form">
                        <label htmlFor="age">Introduce your age:</label>
                        <input className="num-input" type="number" name="age" id="age" min="18" max="120" value={age} onChange={(e) => setAge(e.target.value)} />

                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="Male"
                                    id='male'
                                    name='sex'
                                    checked={gender === 'Male'}
                                    onChange={() => setGender('Male')}
                                />
                                Male
                            </label>
                            <label className='mx-2'>
                                <input
                                    type="radio"
                                    value="Female"
                                    id='female'
                                    name='sex'
                                    checked={gender === 'Female'}
                                    onChange={() => setGender('Female')}
                                />
                                Female
                            </label>
                        </div>

                        <div>
                            <label htmlFor="activityLevel">Select your activity level</label>
                            <select name="activityLevel" id="activityLevel" value={activityLevel} onChange={(e) => setActivityLevele(e.target.value)}>
                                <option value="moderate">Moderate</option>
                                <option value="intense">Intense</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <button className="cal-btn" type="submit">Calculate maintenance calories</button>
                    </form>
                </div>

                <div className="results">
                    {calMacCalcData && (
                        <div>
                            <h3>Basic metabolic rate: {Math.round(calMacCalcData.BMR)}cals</h3>
                            <h3>Maintenance calories: {Math.round(calMacCalcData.TDEE)}cals</h3>
                            <p>Add or take 200 to 500cals to the maintenance calories if you want to gain or lose weight</p>
                            <h4>Recommended protein 🥩 🍗 intake: {calMacCalcData.avgRecProtIntake}g</h4>
                            <h4>Recommended carbs 🍞 🥔 intake: {calMacCalcData.recomCarbsIntake}g</h4>
                            <h4>Recommended fats 🥑 🧈 intake: {calMacCalcData.recomFatIntake}g</h4>
                            <h4>Range of protein grams {calMacCalcData.recomendedProteinRange[0]}g and {calMacCalcData.recomendedProteinRange[1]}g 🥚 🐟</h4>
                        </div>
                    )}
                </div>
            </div>

            <div className="ffmi-table">
                <FfmiScoreTable FFMI={latestFFMI} Bfp={latestData.bodyFatPercentage} gender={gender} />
            </div>
        </>
    )
}