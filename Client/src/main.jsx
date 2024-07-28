// Imports the reactDom package for rendering react compnents in the dom
import ReactDOM from 'react-dom/client';
// Imports the necessary packages for routing with react router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Imports the components
import App from './App.jsx';
import Login from './pages/LogIn.jsx';
import Signin from './pages/SignIn.jsx';

// Imports the styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Defines the routes to wich the components will render
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <h1 className='display-2'>main</h1>
      }, {
        path: '/login',
        element: < Login />
      }, {
        path: '/Signin',
        element: < Signin />
      },
    ]
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)