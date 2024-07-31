import { Link, useLocation } from 'react-router-dom';

import Auth from '../utils/auth';

export default function Nav() {
    // Retrieves the current page location pathname using useLocation() hook
    const currentPg = useLocation().pathname;

    return (
        <ul className='nav'>
            {/* Render the link only if the current location does not match the link's path*/}
            {currentPg !== '/' && (
                <li className='nav-item'>
                    <Link
                        to="/"
                        className='nav-link'>
                        Homepage
                    </Link>
                </li>
            )}
            {currentPg !== '/exercises' && (
                <li className='nav-item'>
                    <Link
                        to="/exercises"
                        className='nav-link'>
                        Exercises
                    </Link>
                </li>
            )}
            {/* Conditional rendering for authenticated and unauthenticated users */}
            {Auth.loggedIn() ? (
                <>
                    <li className='nav-item'>
                        <button
                            className='nav-link btn btn-danger'
                            onClick={Auth.logout}>
                            Logout
                        </button>
                    </li>
                    {currentPg !== '/profile' && (
                        <li className='nav-item'>
                            <Link
                                to="/profile"
                                className='nav-link'>
                                Profile
                            </Link>
                        </li>
                    )}
                </>
            ) : (
                <>
                    {currentPg !== '/login' && (
                        <li className='nav-item'>
                            <Link
                                to="/login"
                                className='nav-link'>
                                Login
                            </Link>
                        </li>
                    )}
                    {currentPg !== '/signin' && (
                        <li className='nav-item'>
                            <Link
                                to='/signin'
                                className='nav-link'>
                                Sign In
                            </Link>
                        </li>
                    )}
                </>
            )}
        </ul>
    );
}
