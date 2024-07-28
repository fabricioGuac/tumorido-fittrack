import { useState } from 'react';
import { useMutation } from '@apollo/client';

import Auth from '../utils/auth';

import { ADD_USER } from '../utils/mutations';



export default function Signin() {
    // State variables for form data and error messages
    const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
    const [errorMessages, setErrorMessages] = useState({ email: '', password: '' });

    const [createUser, { error }] = useMutation(ADD_USER);


    // Function to handle input change 
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });
    };

    // Function to the form submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check with regex
        const emailError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userFormData.email) ? '' : 'Must be a valid email';
        const passwordError = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(userFormData.password) ? '' : 'Password must be at least 8 characters long and contain at least one number, one uppercase letter, one lowercase letter, and one special character';

        // Set the error messages if any
        setErrorMessages({ email: emailError, password: passwordError });

        if (emailError || passwordError) {
            // Stop the form submission if validation fails
            return;
        }

        console.log('Submitted');

        try {
            const { data } = await createUser({
                variables: { username: userFormData.username, email: userFormData.email, password: userFormData.password }
            });

            console.log(data);
            Auth.login(data.login.token);
        } catch (err) {
            console.error(err);
        }

        setUserFormData({
            username: '',
            email: '',
            password: '',
        });

    };

    return (
        <div className="container">
            <h2 className="my-4">Sign In</h2>
            <form onSubmit={handleSubmit}>
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
                        required
                    />
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
                    {errorMessages.email && <div className='text-danger'>{errorMessages.email}</div>}
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
                    {errorMessages.password && <div className='text-danger'>{errorMessages.password}</div>}
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!(userFormData.username && userFormData.email && userFormData.password)}
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}