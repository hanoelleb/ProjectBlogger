import React from 'react';
import {Link} from 'react-router-dom';
import {withAuthorization} from '../Session';

const Notifications = () => (
    < NotifPage />
)

class NotifPageBase extends React.Component {
    render() {
        return <h3>Notifications</h3>
    }
}

const condition = authUser => !!authUser;

const NotifPage = withAuthorization(condition)(NotifPageBase);

export default Notifications;
