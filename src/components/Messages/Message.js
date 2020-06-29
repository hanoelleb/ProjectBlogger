import React from 'react';
import { Link } from 'react-router-dom';
import { withAuthorization } from '../Session';
import { AuthUserContext } from '../Session';


class Message extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const messageKey = this.props.location.state.key;
	const isSent = this.props.location.state.sent;
	console.log('in message: ' + messageKey + ' is sent: ' + isSent);
        return (
	<div>
            <AuthUserContext.Consumer> 
	        { authUser => 
                    <MessagePage authUser={authUser} messageKey={messageKey} isSent={isSent}/>
	        }
            </AuthUserContext.Consumer>
        </div>
	)
    }
}

class MessagePageBase extends React.Component {
    constructor(props) {
        super(props);
	this.state = ({message: '', user: '', key: ''});
    }

    componentDidMount() {
        if (this.props.isSent) {
	    var message = this.props.firebase.messageNumSent(this.props.authUser.uid, this.props.messageKey);
	    message.once('value')
		.then( (snapshot) => {
		    var data = snapshot.val();
		    console.log(data.message);
		    this.setState({message: data.message, user: data.to, key: data.key});
		});
	}
	else {
	    var message = this.props.firebase.messageNumReceived(this.props.authUser.uid, this.props.messageKey);
	    message.once('value')
                .then( (snapshot) => {
                    var data = snapshot.val();
                    console.log(data.message);
                    this.setState({message: data.message, user: data.from, key: data.key});
                });
	}
    }

    renderLink() {
	var pathstr = '/blog/' + this.state.user;
	return (
	    <Link to={{pathname: pathstr, state: { key: this.state.key }}}> {this.state.user} </Link>
	)
    }

    renderMessage() {
	var pathstr = '/blog/' + this.state.user;
	var link = this.renderLink();
        if (this.props.isSent) {
            return (
		<div>
		    <h3>To:
		        {this.renderLink()}
		    </h3>
                    <p>{this.state.message}</p>
		</div>
	    )
	}
	else {
            return (
		 <div>
	              <h3>From: 
		          {this.renderLink()}
		      </h3>
		      <p>{this.state.message}</p>
		 </div>
	    )
	}
    }

    render() {
        return (
	    <div>
	    {this.renderMessage()}
	    </div>
	)
    }
}

const condition = authUser => !!authUser;

const MessagePage = withAuthorization(condition)(MessagePageBase);

export default Message;
