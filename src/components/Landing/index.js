import React from 'react';
import { Link, withRouter } from 'react-router-dom';
 
import { withFirebase } from '../../firebase';
import * as ROUTES from '../../constants/routes';

import styles from '../Styles/landing.module.css';

const Landing = () => (
  <div className = {styles.page}>
    <SignInForm />    
    <h6>Don't have an account? 
	<Link to={ROUTES.SIGN_UP} style={{color: 'white'}}> Sign up!</Link>
    </h6>
  </div>
);

class SignInFormBase extends React.Component {
    constructor(props) {
        super(props);
        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = ({email: '', password: '', error: null});
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          if (authUser != null) {
            this.props.history.push(ROUTES.DASHBOARD);
          }
        },
      );
    }

    componentWillUnmount() {
      this.listener();
    }


    handleSignIn(event) {
        this.props.firebase
            .doSignIn(this.state.email, this.state.password)
	    .then(() => {
	        this.setState({email: '', password: '', error: null});
                this.props.history.push(ROUTES.DASHBOARD)
	    })
	    .catch(error => {
	        this.setState({error});
	    });
       event.preventDefault();
    }

    handleChange(event) {
        this.setState( {[event.target.name]: event.target.value});
    }

    render() {
	const isInvalid = this.state.password === '' || this.state.email === '';
        return (
             <form className = {styles.form} onSubmit = {this.handleSignIn}>
                 <h3>Sign In</h3>
                 <input name='email' value={this.state.email} type='email' 
		     placeholder='Email' onChange={this.handleChange}></input>
                 <input name='password' value={this.state.password} type='password' 
		     placeholder='Password' onChange={this.handleChange}></input>
		 <input type='submit' disabled={isInvalid} value='Sign in'></input>
		 {this.state.error && <p>{this.state.error.message}</p>}
             </form>
	);
    }
}

const SignInForm = withRouter(withFirebase(SignInFormBase));

export default Landing;

