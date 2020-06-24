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
import Other from '../OtherBlog';
import * as ROUTES from '../../constants/routes';
import {withFirebase} from '../../firebase';

import { AuthUserContext } from '../Session';

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
       <div>
           <h1>App</ h1>
	   <AuthUserContext.Provider value={this.state.authUser}>
               <Router>
                   <Navigation />
	           <Route exact path={ROUTES.LANDING} component={Landing} />
                   <Route path={ROUTES.SIGN_UP} component={SignUp} />
	           <Route path={ROUTES.DASHBOARD} component={Dashboard} />
	           <Route path={ROUTES.HOME} component={Home} />
	           <Route path={ROUTES.ACCOUNT} component={Account} />
	           <Route path={ROUTES.EXPLORE} component={Explore} />
	           <Route path={ROUTES.OTHERBLOG} component={Other} />
               </Router>
	   </AuthUserContext.Provider>
      </ div>
     )
   }
}

export default withFirebase(App);
