import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import { withFirebase } from '../../firebase';
import * as ROUTES from '../../constants/routes';

const SignUp = () => (
    <div>
        <SignUpForm />
    </div>
)

class SignUpFormBase extends React.Component {
    constructor(props) {
        super(props);
	this.handleSignUp = this.handleSignUp.bind(this);
        this.handleChange = this.handleChange.bind(this);
	this.state = ({email: '', username: '', password: '', pwconfirm: '', error: null});
    }

    
    handleSignUp(event) {
	this.props.firebase
	    .doCreateUser(this.state.email, this.state.password)
	    .then( authUser => {
                this.setState({email: '', username: '', password: '', pwconfirm: '', error: null});
                this.props.history.push(ROUTES.DASHBOARD);
	    })
	    .catch(error => {
		this.setState({error});
	    });

	event.preventDefault();
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        const isInvalid = this.state.email === '' || this.state.username === '' 
		    || this.state.password === '' || this.state.password !== this.state.pwconfirm;
        return (
            <form onSubmit = {this.handleSignUp}>
                <input name='email' value={this.state.email} type='email' 
		    placeholder='Email' onChange={this.handleChange}></input>
                <input name='username' value={this.state.username} type='text' 
		    placeholder='Username' onChange={this.handleChange}></input>
                <input name='password' value={this.state.password} type='password' 
		    placeholder='Password' onChange={this.handleChange}></input>
                <input name='pwconfirm' value={this.state.pwconfirm} type='password' 
		    placeholder='Reenter password' onChange={this.handleChange}></input>
                <input type='submit' disabled={isInvalid} value='Sign Up!'></input>

		{this.state.error && <p>{this.state.error.message}</p>}
            </form>
	)
    }
}

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUp;
