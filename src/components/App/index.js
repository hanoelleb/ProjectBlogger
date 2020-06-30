import React from 'react';

import { BrowserRouter as Router,
    Route } from 'react-router-dom';
 
import Navigation from '../Navigation';
import Landing from '../Landing';
import SignUp from '../SignUp';
import Dashboard from '../Dashboard';
import Home from '../Home';
import Account from '../Account';
import Explore from '../Explore';
import Notifications from '../Notifications';
import {Messages} from '../Messages';
import {Message} from '../Messages';
import {Followers} from '../Follow';
import {Following} from '../Follow';
import Other from '../OtherBlog';
import * as ROUTES from '../../constants/routes';
import {withFirebase} from '../../firebase';

import { AuthUserContext } from '../Session';

import styles from '../Styles/app.module.css';
console.log('styles: ' + styles);


class App extends React.Component {
   constructor(props) {
       super(props);
       this.state = ({authUser: null});
   }

   componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged( user => {
          user ? this.setState({authUser: user}) : this.setState({authUser: null})
      });
   }

   componentWillUnmount() {
      this.listener();
   }

   render() {
     return (
       <div className={styles.app}>
	   <h2>Soapbox</h2>
	   <AuthUserContext.Provider value={this.state.authUser}>
               <Router>
                   <Navigation />
	           <Route exact path={ROUTES.LANDING} component={Landing} />
                   <Route path={ROUTES.SIGN_UP} component={SignUp} />
	           <Route exact path={ROUTES.DASHBOARD} component={Dashboard} />
	           <Route path={ROUTES.HOME} component={Home} />
	           <Route path={ROUTES.ACCOUNT} component={Account} />
	           <Route path={ROUTES.EXPLORE} component={Explore} />
	           <Route exact path={ROUTES.MESSAGES} component={Messages} />
                   <Route path={ROUTES.MESSAGE_SENT_NUM} component={Message} />
	           <Route path={ROUTES.MESSAGE_REC_NUM} component={Message} />
	           <Route path={ROUTES.OTHERBLOG} component={Other} />
	           <Route path={ROUTES.FOLLOWERS} component={Followers}/>
	           <Route path={ROUTES.FOLLOWING} component={Following}/>
	           <Route path={ROUTES.NOTIFICATIONS} component={Notifications}/>
               </Router>
	   </AuthUserContext.Provider>
      </ div>
     )
   }
}

export default withFirebase(App);
