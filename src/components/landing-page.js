import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import LoginForm from './login-form';

export function LandingPage(props) {
    // If we are logged in redirect straight to the user's dashboard
    console.log('props: ', props)
    if (props.loggedIn) {
        return <Redirect to="/dashboard" />;
    }

    return (
        <div className="home">
            <h2>Welcome to Foo App</h2>
            <LoginForm />
            <Link to="/register">Register</Link>
        </div>
    );
}

export default LandingPage;