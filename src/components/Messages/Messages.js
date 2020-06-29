import React from 'react';
import {withAuthorization} from '../Session';
import {AuthUserContext} from '../Session';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const Messages = () => (
    <AuthUserContext.Consumer>
        { authUser => 	
            <MessagesPage authUser={authUser}/>
	}
    </AuthUserContext.Consumer>
)

class MessagesPageBase extends React.Component {
    constructor(props) {
        super(props);
	this.state = ({sent: [], received: []});
    }

    componentDidMount() {
         var sentList = this.state.sent;
         var sentId = 1;
         var sent = this.props.firebase.messageSent(this.props.authUser.uid);
         sent.once('value')
            .then( snapshot => {
                snapshot.forEach( (message) => {
                    var key = message.key;
		    sentList.push([sentId++, key]);
		    this.setState({sent: sentList});
                });
            });

	 var recList = this.state.received;
         var received = this.props.firebase.messageReceived(this.props.authUser.uid);
	 var recId = 1;
	 var received = this.props.firebase.messageReceived(this.props.authUser.uid);
	 received.once('value')
	    .then( snapshot => {
		snapshot.forEach( (message) => {
		    var key = message.key;
		    recList.push([recId++, key]);
                    this.setState({received: recList});
		});
	    });
    }
    
    renderSentLinks(message) {
        return <Link to={ {pathname: '/messages/sent/' + message[0], state : { key : message[1], sent: true }} }>{ 'message ' + message[0]}</Link>
    }
    
    renderReceivedLinks(message) {
        return (<Link to={ {pathname: '/messages/received/' + message[0], state : { key : message[1], sent : false }} }>
	           { 'message ' + message[0]}
	       </Link>)
    }
    
    render () {
        return (
	    <div>
		<Link to={ROUTES>MESSAGES} {pat
	        <h1>Received</h1>
		{this.state.received.map( (message) => this.renderReceivedLinks(message)) }
	        <h1>Sent</h1>
		{this.state.sent.map( (message) => this.renderSentLinks(message)) }
	    </div>
	)
    }
}

const condition = authUser => !!authUser;

const MessagesPage = withAuthorization(condition)(MessagesPageBase);

export default Messages;
