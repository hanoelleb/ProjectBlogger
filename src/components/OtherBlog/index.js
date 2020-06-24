//so route would be /blogname
import React from 'react';
import {withFirebase} from '../../firebase';
import  { FirebaseContext } from '../../firebase';

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
	console.log('user: ' + userKey);
        return (
	    <FirebaseContext.Consumer>
		{ firebase => {
                    return <ContentBase userKey={userKey} firebase={firebase}/>;
		} }
	    </FirebaseContext.Consumer>
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
	/*
	return (
            <div>
                <div>
                <input type='text' placeholder='Search Soapbox'></input>
            </div>
            <div>
                //<Content key={this.props.location.state.key}/>
            </div>
    </div>
    */
   }
}


class ContentBase extends React.Component {
    constructor(props) {
        super(props);
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
		     console.log(title);
                     var post = PostFactory(title,content,tags);
                     posts.push(post);
                     this.setState({posts: posts});
		});
		this.setState({waiting: false});
	    })
    }

    renderPost(post) {
        return (
            <div key={post.title}>
                <h1>{post.title}</h1>
                <p>{post.content}</p>
                {post.tags.map( (tag,index) => this.addTag(tag,index))}
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

export default Other;
