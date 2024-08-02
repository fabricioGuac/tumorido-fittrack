
export default function ExerciseCard ({exercises}) {


return (
    <>
    {exercises.map((exer, index) => (
                    <div key={index}>
                        <details>
                            <summary>{exer.name}  <strong>Target muscle:</strong> {exer.muscle}</summary>
                            <p><strong>Equipment:</strong> {exer.equipment}</p>
                            <p><strong>Instructions:</strong> {exer.instructions}</p>
                        </details>
                    </div>
                ))}
    </>
);
}