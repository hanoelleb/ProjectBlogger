import React from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../../firebase';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session'
import { withAuthorization } from '../Session';
import DashNav from '../DashNavigation';

import {PostFactory} from '../../models/Post';
//search bar
//navbar - explore, messages, followers, notifications, account
//posts
import styles from '../Styles/blog.module.css';

const Dashboard = () => (
    <div>
	<div>
	    <input type='text' placeholder='Search Soapbox'></input>
	</div>
        < DashNav />
	<div className={styles.postbuttons}>
               <NewPostButton />
               <button style={{color: 'orange'}}>Photo</button>
	       <button style={{color: 'green'}}>Video</button>
	       <button style={{color: 'blue'}}>Audio</button>
	       <button style={{color: 'purple'}}>Link</button>
        </div>
	<div>
	    <AuthUserContext.Consumer>
	        {authUser => <Content user={authUser} />}
            </AuthUserContext.Consumer>
        </div>
    </div>
);

class NewPostButton extends React.Component {
    constructor(props) {
        super(props);
	this.openForm = this.openForm.bind(this);
	this.closeForm = this.closeForm.bind(this);
	this.state = ({ on: false });
    }

    openForm () {
        this.setState({on: true});
    }

    closeForm () {
        this.setState({on: false});
    }

    render() {
        return (
	    <div>
	        <button onClick={this.openForm} style={{color: 'red'}}>Text</button>
                <div>
                    <AuthUserContext.Consumer>
                         {authUser => <PostForm user={authUser} on={this.state.on} handler={this.closeForm}/>}
                    </AuthUserContext.Consumer>
                </div>
            </div>
	)
    }
}

class PostFormBase extends React.Component {
    constructor(props) {
        super(props);
	this.handleSubmit = this.handleSubmit.bind(this);
	this.handleChange = this.handleChange.bind(this);
	this.handleCancel = this.handleCancel.bind(this);
	this.state = ({title: '', content: '', tags: ''});
    }

    handleSubmit(event) {
	var sepTags = this.state.tags.split(',');
	var post = PostFactory(this.state.title, this.state.content, sepTags);
	
	this.props.firebase.posts(this.props.user.uid).push({title: post.title, content : post.content, tags: post.tags})
	    .then( () => {
                this.setState({title: '', content: '', tags: '', on: false});
            });
	
	event.preventDefault();
    }

    handleChange(event) {
        this.setState({[event.target.name] : event.target.value});
    }

    handleCancel() {
        this.setState({title: '', content: '', tags: '', on: false});
    }

    render() {
	if (this.props.on) {
        return (
	        <form className={styles.textPostForm} id='textPostForm' onSubmit={this.handleSubmit}>
	            <input name='title' type='text' placeholder='Title' value={this.state.title} onChange={this.handleChange}></input>
	            <textarea name='content' value={this.state.content} onChange={this.handleChange}></textarea>
		    <input name='tags' type='text' placeholder='separate, tags, with, commas' value={this.state.tags} onChange={this.handleChange}></input>
		    <input type='submit' value='Post'></input>
		    <button onClick={() => { this.handleCancel(); this.props.handler()} }>Cancel</button>
	        </form>
	)}
	else {
	    return null;
	}
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
			const srckey = childData.srckey;
                        var post = PostFactory(title,content,tags,src,srckey);
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

    renderBlogLink(username, key) {
	var pathstr = '/blog/' + username;
        return (
	    <Link to={ {pathname: pathstr, state: {key: key}} }>{username}</Link>
	)
    }

    renderPost(post) {
        return (
	    <div className={styles.post} key={post.title}>
	        <h3>{post.title}</h3>
		{ post.src ? <h3>src: {this.renderBlogLink(post.src, post.srckey)}</h3> : null }
	        <p>{post.content}</p>
	        {post.tags.map( (tag,index) => this.addTag(tag,index))}
	    </div>
	)
    }

    addTag(tag,index) {
        return <span className={styles.tags} key={index}>#{tag}</span>
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
	       <div id='Posts' className={styles.blog}>
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
