import React from 'react';

import withFirebase from '../../firebase';

const SignOutBase = () => (
    <button onClick={this.props.firebase.doSignOut}>Sign Out</button>
)

export default withFirebase(SignOutBase);
