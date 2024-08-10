import { Link } from 'react-router-dom';
import Auth from '../utils/auth';


export default function Homepage() {


    return (
        <div className="homepage">
            <div className="row">
                <div className="col-12 text-center mb-4">
                    <h1>Welcome to Tomorido <span className="text-warning">Fit</span>Track</h1>
                    <p>Your personal fitness tracking companion</p>
                </div>
            </div>

            <div className="row autoshow">
                <div className="col-md-6 d-flex">
                    <div className="">
                        <img src="/bodyGraph.png" alt="Example body graph" className="img-fluid" />
                    </div>
                </div>
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <div className='text-center'>

                        <h2>Track Your Body Progress</h2>
                        <p>Monitor your body composition metrics over time with detailed graphs.</p>
                    </div>
                </div>
            </div>


            <div className="row autoshow">
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <div className='text-center'>

                        <h2>Track Your Strength Progress</h2>
                        <p>Monitor your lifts metrics over time with detailed graphs.</p>
                    </div>
                </div>
                <div className="col-md-6 d-flex">
                    <div className="">
                        <img src="/liftGraph.png" alt="Example lift graph" className="img-fluid" />
                    </div>
                </div>
            </div>


            <div className="row autoshow">
                <div className="col-md-6 d-flex">
                    <div className="">
                        <img src="/calMac.png" alt="Example calories and macronutrients recommendations" className="img-fluid" />
                    </div>
                </div>
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <div className='text-center'>

                        <h2>Personalized Recommendations</h2>
                        <p>Get tailored exercise and nutrition advice based on your progress and goals.</p>
                    </div>
                </div>
            </div>


            <div className="row autoshow">
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <div className='text-center'>

                        <h2>Comprehensive Exercise Database</h2>
                        <p>Access a vast library of exercises with detailed instructions and recommendations.</p>
                    </div>
                </div>
                <div className="col-md-6 d-flex">
                    <div className="">
                        <img src="/exerciseList.png" alt="Exercises lifts" className="img-fluid" />
                    </div>
                </div>
            </div>

            {!Auth.loggedIn() && (
            <div className="row text-center">
                <div className="col-12">
                    <h2>Ready to Get Started?</h2>
                    <p>Sign up today and take the first step towards achieving your fitness goals!</p>
                    <Link to='/signin' className='btn btn-primary'>
                        Sign In
                    </Link>
                </div>
            </div>
            )}
        </div>
    );

}