import React from 'react';
import {Link} from 'react-router-dom';
import {withAuthorization} from '../Session';
import {AuthUserContext} from '../Session';
import * as ROUTES from '../../constants/routes';

const Following = () => (
    <FollowingPage />
)

class FollowingPageBase extends React.Component {
    render() {
        return <h3>Following</h3>
    }
}

const condition = authUser => !!authUser;

const FollowingPage = withAuthorization(condition)(FollowingPageBase);

export default Following;
