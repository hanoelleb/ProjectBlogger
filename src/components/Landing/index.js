import React from 'react';
import { Link } from 'react-router-dom';
 
import * as ROUTES from '../../constants/routes';

const Landing = () => (
  <div>
    <SignInForm />    
    <h6>Don't have an account? 
	<Link to={ROUTES.SIGN_UP}> Sign up!</Link>
    </h6>
  </div>
);

class SignInForm extends React.Component {
    render() {
        return (
             <form>
                 <h3>Sign In</h3>
                 <input type='email' placeholder='Email'></input>
                 <input type='text' placeholder='Username'></input>
                 <input type='password' placeholder='Password'></input>
		 <input type='submit' value='Sign in'></input>
             </form>
	);
    }
}

export default Landing;

