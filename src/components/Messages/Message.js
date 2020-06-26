import React from 'react';
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
	this.state = ({message: ''});
    }

    componentDidMount() {
        if (this.props.isSent) {
	    var message = this.props.firebase.messageNumSent(this.props.authUser.uid, this.props.messageKey);
	    message.once('value')
		.then( (snapshot) => {
		    var data = snapshot.val();
		    console.log(data.message);
		    this.setState({message: data.message});
		});
	}
	else {
	    var message = this.props.firebase.messageNumReceived(this.props.authUser.uid, this.props.messageKey);
	    message.once('value')
                .then( (snapshot) => {
                    var data = snapshot.val();
                    console.log(data.message);
                    this.setState({message: data.message});
                });
	}
    }

    renderMessage() {
        return <p>{this.state.message}</p>
    }

    render() {
        return (
	    <div>
	        <h2>Message</h2>
		{this.renderMessage()}
            </div>
	)
    }
}

const condition = authUser => !!authUser;

const MessagePage = withAuthorization(condition)(MessagePageBase);

export default Message;
