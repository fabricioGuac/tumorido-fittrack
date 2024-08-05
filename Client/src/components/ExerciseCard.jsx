
export default function ExerciseCard({ exercises }) {


    return (
        <>
            {exercises.map((exer, index) => (
                <div key={index} className="exercise-card">
                    <details>
                        <summary className="exercise-summary">{exer.name}   <strong>Target muscle:</strong> {exer.muscle}</summary>
                        <div className="exercise-body">
                            <p><strong>Equipment:</strong> {exer.equipment}</p>
                            <p><strong>Instructions:</strong> {exer.instructions}</p>
                        </div>
                    </details>
                </div>
            ))}
        </>
    );
}