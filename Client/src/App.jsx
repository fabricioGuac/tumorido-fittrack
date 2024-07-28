// Imports the required modules
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { Outlet } from 'react-router-dom';

// Imports the Header component
import Header from './components/Header.jsx';


// Creates an HTTP link for Apollo Client to connect to the GraphQL server
const httpLink = createHttpLink({
    uri: '/graphql',
});


// Middleware to attach the token to every request header
const authLink = setContext((_, { headers }) => {


    const token = localStorage.getItem('id_token');

    console.log(_);
    console.log(headers);
    console.log(token);

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

// Set up the client to execute the authLink middleware
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
})



function App() {
    return (
        // Provides the apollo client to the components 
        <ApolloProvider client={client}>
            <Header />
            <Outlet />
        </ApolloProvider>
    );
}

export default App;