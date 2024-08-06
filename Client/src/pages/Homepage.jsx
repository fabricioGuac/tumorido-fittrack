import { Link } from 'react-router-dom';


export default function Homepage() {




    return (
        <div className="homepage">
            <div className="">
                <h1>Welcome to Tomorido <span className="text-warning">Fit</span>Track</h1>
                <p>Your personal fitness tracking companion</p>
            </div>

                <div className="">
                    <img src="/bodyGraph.png" alt="Example body graph" />
                    <h2>Track Your body Progress</h2>
                    <p>Monitor your body composition metrics over time with detailed graphs.</p>
                </div>


                <div className="">
                    <img src="/liftGraph.png" alt="Example lift graph" />
                    <h2>Track your strenght Progress</h2>
                    <p>Monitor your lifts metrics over time with detailed graphs.</p>
                </div>


                <div className="">
                    <img src="/calMac.png" alt="Example calories and macronutrients recomendations" />
                    <h2>Personalized Recommendations</h2>
                    <p>Get tailored exercise and nutrition advice based on your progress and goals.</p>
                </div>

                <div className="">
                    <img src="/exerciseList.png" alt="Exercises lifts" />
                    <h2>Comprehensive Exercise Database</h2>
                    <p>Access a vast library of exercises with detailed instructions and recommendations.</p>
                </div>

            <div className="">
                <h2>Ready to get started?</h2>
                <p>Sign up today and take the first step towards achieving your fitness goals!</p>
                <Link
                    to='/signin'
                    className='nav-link'>
                    Sign In
                </Link>
            </div>
        </div>

    );
}