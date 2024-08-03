import { useState, useEffect } from "react";
import Graph from "./Graph";

export default function LiftData({ liftOptions, liftsData }) {

    // Sets the state variables to identify the target lift and the lift data that will be displayed in the graph
    const [selectedLift, setSelectedLift] = useState(liftsData[0]?.exercise || "");
    const [graphTarget, setGraphTarget] = useState('totalWeightLifted');
    // Sets state variable to store the graph data
    const [graphData, setGraphdata] = useState({});


    useEffect(() => {
        const filteredLifts = liftsData.filter(lift => lift.exercise === selectedLift);
    
        const result = filteredLifts.reduce((acc, item) => {
            // Formats the date
            acc.dates.push(new Date(item.date).toLocaleDateString()); 
    
            if (graphTarget === 'totalWeightLifted') {
                acc.values.push(item.totalWeightLifted);
            } else if (graphTarget === 'reps' || graphTarget === 'weight') {
                // Ensure there are sets and access the first set
                const firstSet = item.sets[0];
                if (firstSet) {
                    acc.values.push(graphTarget === 'reps' ? firstSet.reps : firstSet.weight);
                } else {
                    // If there are no sets pushes 0
                    acc.values.push(0); 
                }
            } else if (graphTarget === 'sets') {
                // Counts the number of sets
                acc.values.push(item.sets.length);
            }
            return acc;
        }, { dates: [], values: [] });
    
        setGraphdata(result);
    }, [selectedLift, graphTarget]);



    if (liftsData.length < 1) {
        return (
            <h1 className="d-flex justify-content-center align-items-center">No data registered yet</h1>
        )
    }


    return (
        <>
            <label htmlFor="lift-select">Choose a lift:</label>

            <select name="lifts" id="lift-select" value={selectedLift} onChange={(e) => setSelectedLift(e.target.value)}>
                {liftOptions.map(lift => (
                    <option key={lift.exercise} value={lift.exercise}>{lift.exercise}</option>
                ))}
            </select>
            <div className="BLData-container">
                <div className="history-container">
                {liftsData.map((item) => (
                    <div key={item._id}>
                        <details>
                            <summary>{`${item.exercise} - ${new Date(item.date).toLocaleDateString()}`}</summary>
                            <p>Total Weight Lifted: {item.totalWeightLifted} kg</p>
                            <div>
                                {item.sets.map((set, index) => (
                                    <p key={index}>Set {index + 1}: {set.reps} reps with {set.weight} kg</p>
                                ))}
                            </div>
                        </details>
                    </div>
                ))}
                </div>
                
                <div className="chart-container">
                <nav className="navbar navbar-expand-lg bg-light">
                    <div className="container">
                        <ul className="navbar-nav mx-auto">
                            <li className={`nav-item ${graphTarget === "totalWeightLifted" ? "active" : ''}`} onClick={() => setGraphTarget("totalWeightLifted")}>
                                <a className="nav-link">Total Weight Lifted</a>
                            </li>
                            <li className={`nav-item ${graphTarget === "reps" ? "active" : ''}`} onClick={() => setGraphTarget("reps")}>
                                <a className="nav-link">Reps</a>
                            </li>
                            <li className={`nav-item ${graphTarget === "weight" ? "active" : 'weight'}`} onClick={() => setGraphTarget('weight')}>
                                <a className="nav-link">Weight</a>
                            </li>
                            <li className={`nav-item ${graphTarget === "sets" ? "active" : 'weight'}`} onClick={() => setGraphTarget('sets')}>
                                <a className="nav-link">Sets</a>
                            </li>
                        </ul>
                    </div>
                </nav>


                {graphTarget === "totalWeightLifted" && <Graph title="Total Weight Lifted" units="kg" data={graphData} />}
                {graphTarget === "reps" && <Graph title="Reps in the first set" units="Reps" data={graphData} />}
                {graphTarget === "weight" && <Graph title="Weight in the first set" units="kg" data={graphData} />}
                {graphTarget === "sets" && <Graph title="Set count for this lift" units="Sets" data={graphData} />}
            </div>

            </div>
        </>
    )
}

