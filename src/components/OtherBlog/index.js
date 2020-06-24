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
	 console.log(aux.key);
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
                     posts.push([post,childSnapshot.key]);
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
		//console.log(repost.title);
                var ref = this.props.firebase.posts(this.props.authUser.uid)
		    .push({title: repost.title, content: repost.content, tags: repost.tags, src: username});
            });
    }

    renderPost(post) {
        return (
            <div key={post[0].title}>
                <h1>{post[0].title}</h1>
                <p>{post[0].content}</p>
                {post[0].tags.map( (tag,index) => this.addTag(tag,index))}
		<button onClick={() => this.handleLike(post[1])}>Like</button>
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
		    {this.state.posts.map( (post) => this.renderPost(post) )}
	        </div>
	    )
	}
    }
}

//const Content = withFirebase(ContentBase);


const condition = authUser => !!authUser;

export default Other;
