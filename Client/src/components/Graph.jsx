// Imports the Line component from react-chartjs-2 for rendering line charts
import { Line } from "react-chartjs-2";

export default function Graph({ title, units, data }) {

    // Creates an object preparing the data for the chart
    const chartData = {
        // Uses dates or defaults to an empty array
        labels: data.dates || [], 
        datasets: [
            {
                label: `Progress in ${title}`,
                // Uses provided values or defaults to an empty array
                data: data.values || [], 
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
                            // Set the title for the chart
                            text: `Progress in ${title} over time`
                        },
                        legend: {
                            display: false
                        }
                    },
                    responsive: true,
                    scales: {
                        // Sets the titles in the x and y axis
                        x: {
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: units
                            }
                        }
                    }
                }}
            />
        </div>
    );
}