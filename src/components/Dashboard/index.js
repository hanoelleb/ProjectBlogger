import React from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../../firebase';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session'
import { withAuthorization } from '../Session';

import {PostFactory} from '../../models/Post';
//search bar
//navbar - explore, messages, followers, notifications, account
//posts

const Dashboard = () => (
    <div>
	<div>
	    <input type='text' placeholder='Search Soapbox'></input>
	</div>
	<div>
	    <ul>
	        <li>Explore</li>
                <li>Messages</li>
                <li>Followers</li>
                <li>Notifications</li>
                <li>Settings</li>
            </ul>
	</div>
        <div>
	    <button>Text Post</button>
            <button>Photo Post</button>
	</div>
	<div>
	    <AuthUserContext.Consumer>
	        {authUser => <PostForm user={authUser} />}
	    </AuthUserContext.Consumer>
	</div>
    </div>
);

class PostFormBase extends React.Component {
    constructor(props) {
        super(props);
	this.handleSubmit = this.handleSubmit.bind(this);
	this.handleChange = this.handleChange.bind(this);
	this.state = ({title: '', content: '', tags: ''});
    }

    handleSubmit(event) {
	var sepTags = this.state.tags.split(',');
        //this.props.firebase
	var post = PostFactory(this.state.title, this.state.content, sepTags);
	console.log('post title: ' + post.title);
	console.log('post content: ' + post.content);
	console.log('post tags: ' + post.tags);
	//console.log(this.props.firebase);
	//console.log(this.props.user);
	this.props.firebase.posts(this.props.user.uid).set({title: post.title, content : post.content, content: post.tags})
	     .then( () => {
                this.setState({title: '', content: '', tags: ''});
            });
	
	event.preventDefault();
    }

    handleChange(event) {
        this.setState({[event.target.name] : event.target.value});
    }

    render() {
        return (
	    <form onSubmit={this.handleSubmit}>
	        <input name='title' type='text' placeholder='Title' onChange={this.handleChange}></input>
	        <textarea name='content' onChange={this.handleChange}></textarea>
		<input name='tags' type='text' placeholder='separate, tags, with, commas' onChange={this.handleChange}></input>
		<input type='submit' value='Post'></input>
	    </form>
	)
    }
}

const PostForm = withFirebase(PostFormBase);

const condition = authUser => !!authUser;
 
export default withAuthorization(condition)(Dashboard);
