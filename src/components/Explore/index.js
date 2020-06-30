import React from 'react';
import { Link } from 'react-router-dom';
import {withFirebase} from '../../firebase';

const Explore = () => (
    <ExplorePage />
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
         return <Link to={{pathname: pathstr, state: { key: userData[1] }}} >{userData[0]}</Link>
    }

    render() {
	if (this.state.waiting)
            return <div>Explore</div>
	else {
	    return (
	        <div>
		    <div>Explore</div>
		    {this.state.users.map( (userData) => this.renderUserLink(userData)) }
	        </div>
	    )
	}
    }
}

const ExplorePage = withFirebase(ExplorePageBase);

export default Explore;
