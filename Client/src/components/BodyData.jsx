import { useState, useEffect } from "react";
import Graph from "./Graph";
import CalorieCalc from "./CalorieCalc";

export default function BodyData({ bodyData, height, isFemale, age }) {

    // Sets the state variable to identify the target data that will be displayed in the graph
    const [graphTarget, setGraphTarget] = useState('FFMI');
    // Sets state variable to store the graph data
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



    if (bodyData.length < 1) {
        return (
            <h1 className="d-flex justify-content-center align-items-center">No data registered yet</h1>
        )
    }


    return (
        <>
            <div className="BLData-container">
                <div className="history-container">
                    {bodyData.map((item) => (
                        <div key={item.date}>
                            <details>
                                <summary>{`Body measurements in ${new Date(item.date).toLocaleDateString()}`}</summary>
                                <p>Weight: {item.weight}kg</p>
                                <p>Body Fat Percentage: {item.bodyFatPercentage}%</p>
                                <p>FFMI: {calculateFFMI(item.weight, item.bodyFatPercentage)}</p>
                            </details>
                        </div>
                    ))}
                </div>

                <div className="chart-container">
                    <nav className="graph-nav">
                        <div className="container">
                            <ul className="graph-nav-list">
                                <li className={`graph-nav-item ${graphTarget === "FFMI" ? "activeGraph" : ''}`} onClick={() => setGraphTarget("FFMI")}>
                                    <button className="graph-nav-button">FFMI</button>
                                </li>
                                <li className={`graph-nav-item ${graphTarget === "weight" ? "activeGraph" : ''}`} onClick={() => setGraphTarget("weight")}>
                                    <button className="graph-nav-button">Weight</button>
                                </li>
                                <li className={`graph-nav-item ${graphTarget === "bodyFatPercentage" ? "activeGraph" : ''}`} onClick={() => setGraphTarget('bodyFatPercentage')}>
                                    <button className="graph-nav-button">BF%</button>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    {graphTarget === "FFMI" && <Graph title="Fat Free Mass Index" units="FFMI" data={graphData} />}
                    {graphTarget === "bodyFatPercentage" && <Graph title="Body Fat Percentage" units="BF%" data={graphData} />}
                    {graphTarget === "weight" && <Graph title="Weight" units="kg" data={graphData} />}
                </div>
            </div>
            <div>
                <CalorieCalc latestData={bodyData[0]} latestFFMI={calculateFFMI(bodyData[0].weight, bodyData[0].bodyFatPercentage)} height={height} age={age} isFemale={isFemale} />
            </div>
        </>
    )
}
