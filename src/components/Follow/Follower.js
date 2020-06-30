import React from 'react';
import {Link} from 'react-router-dom';
import {withAuthorization} from '../Session';
import {AuthUserContext} from '../Session';
import * as ROUTES from '../../constants/routes';
import DashNav from '../DashNavigation';
import styles from '../Styles/lists.module.css';

const Followers = () => (
    <div>
	< DashNav />
        <AuthUserContext.Consumer>
            { authUser =>
                <FollowersPage authUser={authUser}/>
            }
        </AuthUserContext.Consumer>
    </div>
)

class FollowersPageBase extends React.Component {
    constructor(props) {
        super(props);
	this.state = ({follow: []});
    }

    componentDidMount() {
        var followerList = this.state.follow;
        var ref = this.props.firebase.followers(this.props.authUser.uid);
	ref.once('value')
	    .then( (snapshot) => {
		 snapshot.forEach( (follower) => {
                 followerList.push([follower.val().username, follower.val().userkey]);
		 this.setState({followers: followerList});
		 })
	    });
    }

    renderFollowerLink(follower) {
        //follower[1] is key
	var pathstr = '/blog/' + follower[0];
	return <Link to={ {pathname: pathstr, state : { key : follower[1] } } }>{follower[0]}</Link>
    }
	
    render() {
        return (
            <div className={styles.list}>
	        <h3>Followers</h3>
		<ul>
	        {this.state.follow.map( (follower) => this.renderFollowerLink(follower) ) }
		</ul>
            </div>
	)
    }
}

const condition = authUser => !!authUser;

const FollowersPage = withAuthorization(condition)(FollowersPageBase);

export default Followers;
