//so route would be /blogname
import React from 'react';
import {withFirebase} from '../../firebase';
import  { FirebaseContext } from '../../firebase';
import { AuthUserContext } from '../Session'
 import { withAuthorization } from '../Session'
import {PostFactory} from '../../models/Post';

class Other extends React.Component {
    constructor(props) {
        super(props);
	this.state = {};
    }

    componentDidMount() {
         const aux = this.props.location.state;
	 //console.log(aux.key);
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
	this.state = ({waiting: true, posts: []});
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
    }

    handleLike(postId) {
        console.log('in like');
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

    handleMessage() {
    
    }

    renderPost(post) {
        return (
            <div key={post[0].title}>
                <h1>{post[0].title}</h1>
                <p>{post[0].content}</p>
                {post[0].tags.map( (tag,index) => this.addTag(tag,index))}
		<button onClick={() => this.handleLike(post[1])}>{'Like: ' + post[2]}</button>
		<button onClick={() => this.handleReblog(post[0])}>Reblog</button>
            </div>
        )
    } 

    addTag(tag,index) {
        return <span key={index}>{tag}</span>
    }

    render() {
	if (this.state.waiting)
	    return null;
	else {
            return (
	        <div>
		    <button onClick={this.handleMessage}>Send Message</button>
		    <MessageForm firebase={this.props.firebase} authUser={this.props.authUser} otherUser={this.props.userKey}/>
		    {this.state.posts.map( (post) => this.renderPost(post) )}
	        </div>
	    )
	}
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
       /*
        sendMessage.push({message: message, from: this.props.authUser.uid});

	var saveMessage = this.props.firebase.messageSent(this.props.authUser.uid);
	saveMessage.push({message: message, to: this.props.otherUser})
            .then( () => {
		this.setState({message: ''});
	    });
       event.preventDefault();
       */
    }

    handleChange(event) {
	this.setState({ [event.target.name]: event.target.value});
    }

    render() {
	const invalid = this.state.message === '';

        return (
	    <form onSubmit={this.handleSubmit}>
                <textarea name='message' placeholder='Enter message' value={this.state.message} onChange={this.handleChange}></textarea>
		<input type='submit' value='Send' disabled={invalid}></input>
	    </form>
	)
    }
}

const condition = authUser => !!authUser;

export default Other;
