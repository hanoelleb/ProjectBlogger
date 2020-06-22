import React from 'react';

import {withFirebase} from '../../firebase';

const SignOut = () => (
    < SignOutButton />
)

class SignOutBase extends React.Component {
    render() {
        return (
	    <button onClick={this.props.firebase.doSignOut}>Sign Out</button>
	)
    }
}

const SignOutButton = withFirebase(SignOutBase);

export default SignOut;
