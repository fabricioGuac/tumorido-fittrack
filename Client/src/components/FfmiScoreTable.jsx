import { useState, useEffect } from "react";


export default function FfmiScoreTable ({FFMI, Bfp, gender}){
    // State variable to track the current FFMI score
    const [FfmiScore, setFfmiScore] = useState('');

    const flooredFfmi = Math.floor(FFMI);
    const flooredBfp = Math.floor(Bfp);
    // Object storing the arrays for each genders interpretations
    const FfmiRanges = {
        "Male": [
            {lowFFMI:17 , highFFMI:18, lowBF:10, highBF:18, category: "Skinny man"},
            {lowFFMI:18 , highFFMI:20, lowBF:20, highBF:27, category: "Avarage man"},
            {lowFFMI:19 , highFFMI:21, lowBF:25, highBF:40, category: "Fat man"},
            {lowFFMI:20 , highFFMI:21, lowBF:10, highBF:18, category: "Athlete / Intermediate gym user"},
            {lowFFMI:22 , highFFMI:23, lowBF:6, highBF:12, category: "Advanced gym user"},
            {lowFFMI:24 , highFFMI:25, lowBF:8, highBF:20, category: "Bodybuilder / Powerlifter / Weightlifter"},
        ],
        "Female": [
            {lowFFMI:14 , highFFMI:15, lowBF:20, highBF:25, category: "Skinny woman"},
            {lowFFMI:14 , highFFMI:17, lowBF:22, highBF:35, category: "Avarage woman"},
            {lowFFMI:15 , highFFMI:18, lowBF:30, highBF:45, category: "Fat woman"},
            {lowFFMI:16 , highFFMI:17, lowBF:18, highBF:25, category: "Athlete / Intermediate gym user"},
            {lowFFMI:18 , highFFMI:20, lowBF:15, highBF:22, category: "Advanced gym user"},
            {lowFFMI:19 , highFFMI:21, lowBF:15, highBF:30, category: "Bodybuilder / Powerlifter / Weightlifter"},
        ]
    }

    // When the component is rendered or the values of FFMI, Bfp or gender change. it gets the interpretations for the current gender
useEffect(() => {
    const rangeForCurrentGender = FfmiRanges[gender];

    // Iterates over the gender interpretations to check wich matches
    for(let i = 0; i < 6; i++){
        if(flooredFfmi >= rangeForCurrentGender[i].lowFFMI && flooredFfmi <= rangeForCurrentGender[i].highFFMI && flooredBfp >= rangeForCurrentGender[i].lowBF && flooredBfp <= rangeForCurrentGender[i].highBF){
            setFfmiScore(rangeForCurrentGender[i].category);
            return;
        }
        // If it is the last loop updates the score
        if(i === 5){
            // Edge case if no category matches the user (Very common, there are not many reference tables for ffmi)
            setFfmiScore('UNCATEGORIZED');
        }
    }
}, [FFMI, Bfp, gender])


    return (
<>
    {FfmiScore && <h2>As of your last measurements you fit in the {FfmiScore} category</h2>}
    <h2>FFMI interpretation for men</h2>
    <table>
        <thead>
            <tr>
                <th>FFMI</th>
                <th>Bf%</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>17-18</td>
                <td>10-18%</td>
                <td>Skinny man</td>
            </tr>
            <tr>
                <td>18-20</td>
                <td>20-27%</td>
                <td>Avarage man</td>
            </tr>
            <tr>
                <td>19-21</td>
                <td>25-40%</td>
                <td>Fat man</td>
            </tr>
            <tr>
                <td>20-21</td>
                <td>10-18%</td>
                <td>Athlete / Intermediate gym user</td>
            </tr>
            <tr>
                <td>22-23</td>
                <td>6-12%</td>
                <td>Advanced gym user</td>
            </tr>
            <tr>
                <td>24-25</td>
                <td>8-20%</td>
                <td>Bodybuilder / Powerlifter / Weightlifter</td>
            </tr>
        </tbody>
    </table>
    <h2>FFMI interpretation for women</h2>
    <table>
        <thead>
            <tr>
                <th>FFMI</th>
                <th>Bf%</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>14-15</td>
                <td>20-25%</td>
                <td>Skinny woman</td>
            </tr>
            <tr>
                <td>14-17</td>
                <td>22-35%</td>
                <td>Avarage woman</td>
            </tr>
            <tr>
                <td>15-18</td>
                <td>30-45%</td>
                <td>Fat woman</td>
            </tr>
            <tr>
                <td>16-17</td>
                <td>18-25%</td>
                <td>Athlete / Intermediate gym user</td>
            </tr>
            <tr>
                <td>18-20</td>
                <td>15-22%</td>
                <td>Advanced gym user</td>
            </tr>
            <tr>
                <td>19-21</td>
                <td>15-30%</td>
                <td>Bodybuilder / Powerlifter / Weightlifter</td>
            </tr>
        </tbody>
    </table>
</>

    )
}

