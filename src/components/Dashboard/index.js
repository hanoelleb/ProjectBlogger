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
	        <li><Link to={ROUTES.EXPLORE}>Explore</Link></li>
                <li><Link to={ROUTES.MESSAGES}>Messages</Link></li>
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
	<div>
	    <AuthUserContext.Consumer>
	        {authUser => <Content user={authUser} />}
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
	var post = PostFactory(this.state.title, this.state.content, sepTags);
	
	this.props.firebase.posts(this.props.user.uid).push({title: post.title, content : post.content, tags: post.tags})
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


//Holds all posts
class ContentBase extends React.Component {
    constructor(props) {
        super(props);
	this.state = ({
	  user: null,
          loading: false,
          posts: [],
	  waitingforposts: true
        });
    }

   componentDidMount() {
        this.authUser(this.props.firebase).then((user) => {
	    this.setState({user: user});
	    var posts = [];
            var ref = this.props.firebase.posts(this.props.user.uid);
            ref.once('value')
                .then( (snapshot) => {
                    snapshot.forEach( (childSnapshot) => {
                        const childData = childSnapshot.val();
                        const title = childData.title;
                        const content = childData.content;
                        const tags = childData.tags;
			const src = childData.src;
                        var post = PostFactory(title,content,tags,src);
                        posts.push(post);
			this.setState({posts: posts});
                   });
               });

               this.setState({waitingforposts: false});
               this.setState({posts: posts});
	       //console.log(posts);
	})
    }

   authUser(firebase) {
      return new Promise(function (resolve, reject) {
        firebase.auth.onAuthStateChanged(function(user) {
            if (user) {
               resolve(user);
               } else {
                 reject('User not logged in');
               }             
           });
       });
    }

    renderPost(post) {
        return (
	    <div key={post.title}>
	        <h1>{post.title}</h1>
		{ post.src ? <h3>src: {post.src}</h3> : null }
	        <p>{post.content}</p>
	        {post.tags.map( (tag,index) => this.addTag(tag,index))}
	    </div>
	)
    }

    addTag(tag,index) {
        return <span key={index}>{tag}</span>
    }

    render() {
	if (this.state.waitingforposts) {
            return (
	       <div>
	           <h2>Your posts</h2>
	       </div>
	    )
	} else {
	    return (   
	       <div id='Posts'>
                   <h2>Your posts</h2>
		   {this.state.posts.map( (post) => this.renderPost(post) )}
               </div>
	    )
	}
    }
}

const Content = withFirebase(ContentBase);

const condition = authUser => !!authUser;
 
export default withAuthorization(condition)(Dashboard);
