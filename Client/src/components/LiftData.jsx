import { useState } from "react";
import Graph from "./Graph";

export default function LiftData ({liftOptions, liftsData}) {
//     <Graph
//     title='Bench press'
//     units='kg'
//     data={{
//         dates: ['January', 'February', 'March'],
//         values: [60, 62, 65]
//     }}
// />
    // Sets the state variables to identify the target lift and the lift data that will be displayed in the graph
    const [selectedLift, setSelectedLift] = useState(liftsData[0].exercise);
    const [graphTarget, setGraphTarget] = useState('totalWeightLifted');






    return (
        <div className="profile-container">
            {/* TODO: Display the lift options and then display the history (Styling wise should be the same) */}
            <div className="history-container">

            </div>

        </div>
    ) 
}

