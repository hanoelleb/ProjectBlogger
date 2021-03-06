import React from 'react';
import {withFirebase} from '../../firebase';
import  { FirebaseContext } from '../../firebase';
import { AuthUserContext } from '../Session'
import { withAuthorization } from '../Session'
import {PostFactory} from '../../models/Post';

import styles from '../Styles/blog.module.css';

class Other extends React.Component {
    constructor(props) {
        super(props);
	this.state = {};
    }

    componentDidMount() {
         const aux = this.props.location.state;
    }

    renderContent() {
	const userKey = this.props.location.state.key;
	return (
	    <AuthUserContext.Consumer>
	    { authUser => {
	        return (    
		    <FirebaseContext.Consumer >
	                {firebase => { return <ContentBase userKey={userKey} firebase={firebase} authUser={authUser}/> } }
	            </FirebaseContext.Consumer>
		)
	        }
	    }
	    </AuthUserContext.Consumer>
	)
    }

    render() {
	if (this.props.location.state.key !== null)
	    return (
	        <div>
		    {this.renderContent()}
		</div>
	    )
	else
	    return null;
   }
}


class ContentBase extends React.Component {
    constructor(props) {
        super(props);
	this.handleLike = this.handleLike.bind(this);
	this.handleReblog = this.handleReblog.bind(this);
	this.handleFollow = this.handleFollow.bind(this);
	this.state = ({waiting: true, posts: [], user: ''});
    }

    componentDidMount() {
        const key = this.props.userKey;
	var posts = [];
	var ref = this.props.firebase.posts(key);
	ref.once('value')
	    .then( (snapshot) => {
	        snapshot.forEach( (childSnapshot) => {
		     const childData = childSnapshot.val();
                     const title = childData.title;
                     const content = childData.content;
                     const tags = childData.tags;
                     var post = PostFactory(title,content,tags);
                     posts.push([post,childSnapshot.key,childData.likes]);
                     this.setState({posts: posts});
		});
		this.setState({waiting: false});
	    })

	var getUser = this.props.firebase.user(key);
	getUser.once('value')
	    .then( (snapshot) => {
	          const data = snapshot.val();
		  this.setState({user: data.username});
	    })
    }

    handleLike(postId) {
	const key = this.props.userKey;
	var likes = this.props.firebase.likes(key,postId);
	likes.once('value')
	    .then( (snapshot) => {
	        var likeNum = snapshot.val();
		likeNum++;
		var ref = this.props.firebase.post(key,postId);
                ref.update({likes: likeNum});
	    });
    }

    handleReblog(post) {
       var src = this.props.firebase.user(this.props.userKey);
       src.once('value')
            .then( (snapshot) => {
		var username = snapshot.val().username;
                var repost = PostFactory(post.title, post.content, post.tags, username);
                var ref = this.props.firebase.posts(this.props.authUser.uid)
		    .push({title: repost.title, content: repost.content, tags: repost.tags, src: username, srckey: this.props.userKey});
            });
    }

    handleFollow() {
        //add to following for current user
	var addToFollowing = this.props.firebase.following(this.props.authUser.uid).push({username: this.state.user, userkey: this.props.userKey}); 

	var addToFollowers = this.props.firebase.followers(this.props.userKey);;
        
	var getUser = this.props.firebase.user(this.props.authUser.uid);
	const authKey = this.props.authUser.uid;
	getUser.once('value')
	    .then( (snapshot) => {
	        var user = snapshot.val().username;
		addToFollowers.push({username: user, userkey: authKey});
	    })
    }

    renderPost(post) {
        return (
            <div className={styles.post} key={post[0].title}>
                <h3>{post[0].title}</h3>
                <p>{post[0].content}</p>
                {post[0].tags.map( (tag,index) => this.addTag(tag,index))}
		<button onClick={() => this.handleLike(post[1])}>{'Like: ' + post[2]}</button>
		<button onClick={() => this.handleReblog(post[0])}>Reblog</button>
            </div>
        )
    } 

    addTag(tag,index) {
        return <span className={styles.tags} key={index}>#{tag}</span>
    }

    render() {
	if (this.state.waiting)
	    return null;
	else {
            return (
	        <div className={styles.blog}>
		    <MessageButton firebase={this.props.firebase} authUser={this.props.authUser} otherUser={this.props.userKey} />
		    <button onClick={this.handleFollow}>Follow</button>
		    {this.state.posts.map( (post) => this.renderPost(post) )}
	        </div>
	    )
	}
    }
}

class MessageButton extends React.Component {
    constructor(props) {
        super(props);
	this.openForm = this.openForm.bind(this);
	this.closeForm = this.closeForm.bind(this);
        this.state = ({on: false});
    }

    openForm() {
        this.setState({on: true});
    }

    closeForm() {
        this.setState({on: false});
    }

    render() {
        return (
	    <div>
		<button onClick={this.openForm}>Send Message</button>
                < MessageForm firebase={this.props.firebase} authUser={this.props.authUser} 
		      otherUser={this.props.otherUser} handler={this.closeForm} on={this.state.on}/>
	    </div>
	)
    }
}

class MessageForm extends React.Component {
    constructor(props) {
        super(props);
	this.handleSubmit = this.handleSubmit.bind(this);
	this.handleChange = this.handleChange.bind(this);
	this.state = ({message: ''});
    }

    handleSubmit(event) {
	event.preventDefault();
        const message = this.state.message;

	var sendMessage = this.props.firebase.messageReceived(this.props.otherUser);

	var authUserName = this.props.firebase.user(this.props.authUser.uid);
        authUserName.once('value')
	    .then( (snapshot) => {
	         var username = snapshot.val().username;
                 sendMessage.push({message: message, from: username, key: this.props.authUser.uid});
	    });

	var saveMessage = this.props.firebase.messageSent(this.props.authUser.uid);

	var otherUserName = this.props.firebase.user(this.props.otherUser);
	otherUserName.once('value')
	    .then( (snapshot) => {
	          var username = snapshot.val().username;
		  saveMessage.push({message: message, to: username, key: this.props.otherUser});
	    })
	    .then ( () => {
	        this.setState({message: ''})
	    });
    }

    handleChange(event) {
	this.setState({ [event.target.name]: event.target.value});
    }

    render() {
	const invalid = this.state.message === '';
        if (this.props.on) {
        return (
	    <form className={styles.messageForm} onSubmit={this.handleSubmit}>
                <textarea name='message' placeholder='Enter message' value={this.state.message} onChange={this.handleChange}></textarea>
		<input type='submit' value='Send' disabled={invalid}></input>
		<button onClick={this.props.handler}>Cancel</button>
	    </form>
	) } 
	else { return null; }
    }
}

const condition = authUser => !!authUser;

export default Other;
