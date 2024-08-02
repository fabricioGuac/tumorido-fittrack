
export default function ExerciseCard ({exercises}) {


return (
    <>
    {exercises.map((exer, index) => (
                    <div key={index}>
                        <details>
                            <summary>{`${exer.name}  target muscle:${exer.muscle}`}</summary>
                            <p className="card-text"><strong>Equipment:</strong> {exer.equipment}</p>
                            <p className="card-text"><strong>Instructions:</strong> {exer.instructions}</p>
                        </details>
                    </div>
                ))}
    </>
);
}