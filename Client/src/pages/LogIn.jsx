import { useState } from 'react';
import { useMutation } from '@apollo/client';


import Auth from '../utils/auth';

import { LOGIN_USER } from '../utils/mutations';


export default function Login() {

    // Sets state variable for the form 
    const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');


    const [loginUser, { error }] = useMutation(LOGIN_USER);



    // Function to handle input change 
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });
    };

    // Function to the form submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('submited')

        try {
            const { data } = await loginUser({
                variables: { email: userFormData.email, password: userFormData.password }
            });

            console.log(data);
            Auth.login(data.login.token);
        } catch (err) {
            console.log(err.message);
            setErrorMessage(err.message)
        }

        setUserFormData({
            username: '',
            email: '',
            password: '',
        });

    }

    return (
        <div className='container'>
            <h2 className="text-center mt-3">Login</h2>
            <div className="logSign-forms d-flex flex-column flex-md-row">
                <form className='col-12 col-md-6 p-4 mt-4' onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Your email"
                            value={userFormData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="Your password"
                            value={userFormData.password}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!(userFormData.email && userFormData.password)}
                    >
                        Sign In
                    </button>
                {errorMessage && <div className='text-danger'><h4>{errorMessage}</h4></div>}
                </form>
                <div className='col-12 col-md-6 p-4'>
                    <div>
                        <h2>Welcome Back to Tumorido Fittrack</h2>
                        <p>Access your personalized fitness dashboard.</p>
                        <ul>
                            <li>Review your tracked body measurements and lift stats.</li>
                            <li>Analyze your data with charts and insights.</li>
                            <li>Explore new exercises from our database.</li>
                            <li>Get personalized nutrition recommendations.</li>
                        </ul>
                        <p>Log in to continue your fitness journey and reach your goals faster!</p>
                    </div>
                </div>
            </div>
        </div>
    )
}