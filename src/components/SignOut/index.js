import React from 'react';

import {withFirebase} from '../../firebase';

const SignOut = () => (
    < SignOutButton />
)

class SignOutBase extends React.Component {
    render() {
        const style = {
	    color: 'white',
            background: 'transparent',
            border: 'none',
            fontSize: '100%',
	}

        return (
	    <button style={style} onClick={this.props.firebase.doSignOut}>Sign Out</button>
	)
    }
}

const SignOutButton = withFirebase(SignOutBase);

export default SignOut;
