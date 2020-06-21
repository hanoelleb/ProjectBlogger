import React from 'react';

const SignUp = () => (
    <div>
        <SignUpForm />
    </div>
)

class SignUpForm extends React.Component {
    render() {
        return (
            <form>
                <input type='email' placeholder='Email'></input>
                <input type='text' placeholder='Username'></input>
                <input type='password' placeholder='Password'></input>
                <input type='submit' value='Sign Up!'></input>
            </form>
	)
    }
}

export default SignUp;
