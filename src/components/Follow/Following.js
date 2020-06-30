import React from 'react';
import {Link} from 'react-router-dom';
import {withAuthorization} from '../Session';
import {AuthUserContext} from '../Session';
import * as ROUTES from '../../constants/routes';

const Following = () => (
    <AuthUserContext.Consumer>
	{authUser => 
            <FollowingPage authUser={authUser}/>
	}
    </AuthUserContext.Consumer>
)


class FollowingPageBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({follow: []});
    }

    componentDidMount() {
        var followingList = this.state.follow;
        var ref = this.props.firebase.following(this.props.authUser.uid);
        ref.once('value')
            .then( (snapshot) => {
                 snapshot.forEach( (follower) => {
                 followingList.push([follower.val().username, follower.val().userkey]);
                 this.setState({followers: followingList});
                 })
            });
    }

    renderFollowingLink(follower) {
        //follower[1] is key
        var pathstr = '/blog/' + follower[0];
        return <Link to={ {pathname: pathstr, state : { key : follower[1] } } }>{follower[0]}</Link>
    }

    render() {
        return (
            <div id='Following'>
                <h3>Following</h3>
                {this.state.follow.map( (following) => this.renderFollowingLink(following) ) }
            </div>
        )
    }
}

const condition = authUser => !!authUser;

const FollowingPage = withAuthorization(condition)(FollowingPageBase);

export default Following;
