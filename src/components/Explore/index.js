import React from 'react';
import { Link } from 'react-router-dom';
import {withFirebase} from '../../firebase';
import styles from '../Styles/lists.module.css';
import DashNav from '../DashNavigation';

const Explore = () => (
    <div>
	< DashNav />
        <ExplorePage />
    </div>
)

class ExplorePageBase extends React.Component {
    constructor(props) {
        super(props);
	this.state = {waiting: true, users: []};
    }

    componentDidMount() {
	var users = [];
        var ref = this.props.firebase.users();
	ref.once('value')
	    .then( (userIds) => {
		 userIds.forEach( (user) => {
		     var userData = user.val();
                     users.push([userData.username, user.key]);
		 });
	         this.setState({users: users});
		 this.setState({waiting: false});
	    });
    }

    renderUserLink(userData) {
	 var pathstr = '/blog/' + userData[0];
         return <li><Link to={{pathname: pathstr, state: { key: userData[1] }}} >{userData[0]}</Link></li>
    }

    render() {
	if (this.state.waiting)
            return <div>Explore</div>
	else {
	    return (
	        <div className={styles.list}>
		    <div>Explore</div>
		    <ul>
		         {this.state.users.map( (userData) => this.renderUserLink(userData)) }
		    </ul>
	        </div>
	    )
	}
    }
}

const ExplorePage = withFirebase(ExplorePageBase);

export default Explore;
