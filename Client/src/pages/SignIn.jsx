import { useState } from 'react';
import { useMutation } from '@apollo/client';

import Auth from '../utils/auth';

import { ADD_USER } from '../utils/mutations';



export default function Signin() {
    // State variables for form data and error messages
    const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '', gender: 0, birthday: '', height: null });
    const [system, setSystem] = useState('metric');
    const [errorMessages, setErrorMessages] = useState({ email: '', password: '', username: '' });

    const [createUser, { error }] = useMutation(ADD_USER);

        // Converter functions to parse the imperial system to metric
        function heightToCm(height) {
            if (system === 'metric') {
                return parseFloat(height);
            }
    
            // Splits the input by anything but a number
            const parts = height.trim().split(/\D+/);
    
    
            // Initializes feet and inches
            let feet = 0;
            let inches = 0;
    
            // Determine feet and inches
            if (parts.length === 1) {
                // If only one part assumes it's all feets if it looks like a single number
                return (parseFloat(parts[0]) * 30.48);
            } else {
                feet = parseFloat(parts[0]);
                inches = parseFloat(parts[1]);
            }
    
            // Converts feets and inches to centimeters
            const totalInches = (feet * 12) + inches;
            const heightInCm = totalInches * 2.54;
    
            return heightInCm;
        }


    // Function to handle input change 
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({
            ...userFormData,
            [name]: name === 'gender' ? parseInt(value) : value
        });
    };
    // Fucntion to handle system change
    const handleSystemChange = (event) => {
        setSystem(event.target.value)
    }


    // Function to the form submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check with the email with regex
        const emailError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userFormData.email) ? '' : 'Must be a valid email';

        // Check that the username lenght
        const usernameError = userFormData.username.length <= 50 ? '' : 'Username must be under 50 characters long'

        // Check with regex for each password requirement
        const hasMinLength = userFormData.password.length >= 8;
        const hasUppercase = /[A-Z]/.test(userFormData.password);
        const hasLowercase = /[a-z]/.test(userFormData.password);
        const hasNumber = /\d/.test(userFormData.password);
        const hasSpecialChar = /[@$!%*?&]/.test(userFormData.password);

        // Construct specific error messages based on each requirement
        let passwordError = '';
        if (!hasMinLength) {
            passwordError = 'Password must be at least 8 characters long';
        } else if (!hasUppercase) {
            passwordError = 'Password must contain at least one uppercase letter';
        } else if (!hasLowercase) {
            passwordError = 'Password must contain at least one lowercase letter';
        } else if (!hasNumber) {
            passwordError = 'Password must contain at least one number';
        } else if (!hasSpecialChar) {
            passwordError = 'Password must contain at least one special character (@$!%*?&)';
        }
        // Set the error messages if any
        setErrorMessages({ email: emailError, password: passwordError, username: usernameError });

        if (emailError || passwordError || usernameError) {
            // Stop the form submission if validation fails
            return;
        }

        console.log({...userFormData,
                        birthday: new Date(userFormData.birthday).getTime(),
                        height: heightToCm(userFormData.height)});

        try {
            const { data } = await createUser({
                variables: { 
                    ...userFormData,
                    birthday: new Date(userFormData.birthday).getTime(),
                    height: heightToCm(userFormData.height),
            }
            });

            console.log(data);
            Auth.login(data.createUser.token);
        } catch (err) {
            if (err.message.includes('duplicate key') && err.message.includes('username')) {
                // Handles duplicate username error
                setErrorMessages({ username: `Username already taken try: ${userFormData.username}${Math.floor(Math.random() * 999) + 1} ` });
                console.error('An error occurred:', err.message, err);
            } else if (err.message.includes('duplicate key') && err.message.includes('email')) {
                // Handles duplicate email error
                setErrorMessages({ email: 'Email already taken' });
                console.error('An error occurred:', err.message);
            } else {
                // Handles edge cases
                console.log('Full error:', err.message);
            }
        }

        console.log('Submitted');

        setUserFormData({
            username: '',
            email: '',
            password: '',
            gender: 0,
            birthday: '',
            height: '',
        });

    };

    return (
        <div className='container'>
            <h2 className="text-center mt-3">Sign in</h2>
            <div className="logSign-forms d-flex flex-column flex-md-row">
                <form className='col-12 col-md-6 p-4 mt-4' onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-control"
                            placeholder="Your username"
                            value={userFormData.username}
                            onChange={handleInputChange}
                        />
                        {errorMessages.username && <div className='text-danger'><h4>{errorMessages.username}</h4></div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Your email"
                            value={userFormData.email}
                            onChange={handleInputChange}
                        />
                        {errorMessages.email && <div className='text-danger'><h4>{errorMessages.email}</h4></div>}
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
                        {errorMessages.password && <div className='text-danger'><h4>{errorMessages.password}</h4></div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="birthday" className="form-label">Birthday</label>
                        <input
                            type="date"
                            id="birthday"
                            name="birthday"
                            value={userFormData.birthday}
                            onChange={handleInputChange}
                            className="form-control rounded"
                        />
                    </div>

                    <div className='mb-3'>
                <label >
                    <input
                        type="radio"
                        value="metric"
                        id='metric'
                        name='system'
                        checked={system === 'metric'}
                        onChange={handleSystemChange}
                    />
                    Metric
                </label>
                <label  className='mx-2'>
                    <input
                        type="radio"
                        value="imperial"
                        id='imperial'
                        name='system'
                        checked={system === 'imperial'}
                        onChange={handleSystemChange}
                    />
                    Imperial
                </label>
            </div>


                    <label htmlFor="height" className="form-label">Height</label>
                    <input
                        type='text'
                        name='height'
                        id='height'
                        value={userFormData.height}
                        onChange={handleInputChange}
                        placeholder='Height'
                        className='form-control'
                    />

                    <div className="my-3">
                        <label>
                            <input
                                type="radio"
                                value={0}
                                name="gender"
                                checked={userFormData.gender === 0}
                                onChange={handleInputChange}
                            />
                            Male
                        </label>
                        <label className='mx-2'>
                            <input
                                type="radio"
                                value={1}
                                name="gender"
                                checked={userFormData.gender === 1}
                                onChange={handleInputChange}
                            />
                            Female
                        </label>
                    </div>


                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!(userFormData.username && userFormData.email && userFormData.password && userFormData.birthday && userFormData.height)}
                    >
                        Sign In
                    </button>
                </form>
                <div className='col-12 col-md-6 p-4'>
                    <div>
                        <h2>Join Tumorido Fittrack</h2>
                        <p>Start tracking your fitness journey today!</p>
                        <ul>
                            <li>Track your body measurements and lifting stats over time.</li>
                            <li>Visualize your progress with easy-to-understand charts.</li>
                            <li>Browse our extensive exercise database.</li>
                            <li>Calculate your calorie and macronutrient needs.</li>
                        </ul>
                        <p>Sign up now and take the first step towards achieving your fitness goals!</p>
                    </div>
                </div>
            </div>
        </div>
    );

}