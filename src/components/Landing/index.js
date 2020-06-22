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
    constructor(props) {
        super(props);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = ({email: '', password: '', error: null});
    }

    handleSignIn() {
    }

    handleChange(event) {
        this.setState( {[event.target.name]: event.target.value});
    }

    render() {
        return (
             <form onSubmit = {this.handleSignIn}>
                 <h3>Sign In</h3>
                 <input type='email' placeholder='Email'></input>
                 <input type='text' placeholder='Username'></input>
                 <input type='password' placeholder='Password'></input>
		 <input type='submit' value='Sign in'></input>
		 {this.state.error && <p>{this.state.error.message}</p>}
             </form>
	);
    }
}

export default Landing;

