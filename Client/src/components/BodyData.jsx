import { useState, useEffect } from "react";
import Graph from "./Graph";

export default function BodyData({ bodyData, height }) {

    // Sets the state variable to identify the target data that will be displayed in the graph
    const [graphTarget, setGraphTarget] = useState('FFMI');
    // Sets state variable to store keep the graph data
    const [graphData, setGraphdata] = useState({});

    // Function to calculate FFMI
    const calculateFFMI = (weight, bodyFatPercentage) => {
        const fatFreeMass = weight * (1 - bodyFatPercentage / 100);
        // Converts height to meters
        const heightM = height / 100;
        const ffmi = fatFreeMass / (heightM * heightM);
        return parseFloat(ffmi.toFixed(2))
    };

    useEffect(() => {

        // Reduce method to extract the values and dates from the target field
        const result = bodyData.reduce((acc, item) => {
            acc.dates.push(new Date(item.date).toLocaleDateString());
            if (graphTarget === 'FFMI') {
                acc.values.push(calculateFFMI(item.weight, item.bodyFatPercentage));
            } else {
                acc.values.push(item[graphTarget]);
            }
            return acc;
        }, { dates: [], values: [] });

        setGraphdata(result);

    }, [graphTarget]);



    if (bodyData.lenght < 1) {
        return (
            <h1 className="justify-content-center align-items-center">No data registered yet</h1>
        )
    }


    return (
        <div className="BLData-container">
            <div className="history-container">
                {bodyData.map((item, index) => (
                    <div key={index}>
                        <details>
                            <summary>{item.date}</summary>
                            <p>Weight: {item.weight}</p>
                            <p>Body Fat Percentage: {item.bodyFatPercentage}</p>
                            <p>FFMI: {calculateFFMI(item.weight, item.bodyFatPercentage)}</p>
                        </details>
                    </div>
                ))}
            </div>

            <div className="chart-container">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav">
                            <li className={`nav-item ${graphTarget === "FFMI" ? "active" : ''}`} onClick={() => setGraphTarget("FFMI")}>
                                <a className="nav-link">FFMI</a>
                            </li>
                            <li className={`nav-item ${graphTarget === "weight" ? "active" : ''}`} onClick={() => setGraphTarget("weight")}>
                                <a className="nav-link">Weight</a>
                            </li>
                            <li className={`nav-item ${graphTarget === "bodyFatPercentage" ? "active" : ''}`} onClick={() => setGraphTarget('bodyFatPercentage')}>
                                <a className="nav-link">BF%</a>
                            </li>
                        </ul>
                    </div>
                </nav>

                {graphTarget === "FFMI" && <Graph title="Fat Free Mass Index" units="FFMI" data={graphData} />}
                {graphTarget === "bodyFatPercentage" && <Graph title="Body Fat Percentage" units="BF%" data={graphData} />}
                {graphTarget === "weight" && <Graph title="Weight" units="kg" data={graphData} />}
            </div>
        </div>
    )
}
