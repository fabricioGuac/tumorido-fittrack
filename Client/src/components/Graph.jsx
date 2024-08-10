// Imports the Line component from react-chartjs-2 for rendering line charts
import { Line } from "react-chartjs-2";

export default function Graph({ title, units, data }) {


    // Initializes variables to store reversed arrays
    let reversedDates = [];
    let reversedValues = [];

    // Checks if data.dates and data.values are arrays
    if (Array.isArray(data.dates) && Array.isArray(data.values)) {
         // Reverses the arrays to display the data from earliest on the left to latest on the right
        reversedDates = [...data.dates].reverse();

        reversedValues = [...data.values].reverse();

    } else {
        console.log("Data dates and values are not arrays.");
    }


    // Creates an object preparing the data for the chart
    const chartData = {
        // Uses dates or defaults to an empty array
        labels: reversedDates || [], 
        datasets: [
            {
                label: `Progress in ${title}`,
                // Uses provided values or defaults to an empty array
                data: reversedValues|| [], 
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                pointRadius: 5,
            }
        ]
    };


    return (
        <div className="chart-container">
            {/* Displays the title */}
            <h2 className="text-center">{title}</h2>
            <Line
                data={chartData}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            // Set the title for the chart and its color
                            text: `Progress in ${title} over time`,
                            color: '#FFFFFF'
                        },
                        legend: {
                            display: false
                        }
                    },
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time',
                                color: '#FFFFFF'
                            },
                            // Defines the color of the labels in the y axis
                            ticks: {
                                color: '#FFFFFF' 
                            },
                            // Defines the grid line in the y axis
                            grid: {
                                color: 'rgba(255, 255, 255, 0.2)' 
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: units,
                                color: '#FFFFFF'
                            },
                            // Defines the color of the labels in the y axis
                            ticks: {
                                color: '#FFFFFF'
                            },
                            // Defines the grid line in the y axis
                            grid: {
                                color: 'rgba(255, 255, 255, 0.2)' 
                            }
                        }
                    },
                }}
            />
        </div>
    );
    
}