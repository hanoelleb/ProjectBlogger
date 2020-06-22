import React from 'react';

import { BrowserRouter as Router,
    Route } from 'react-router-dom';
 
import Navigation from '../Navigation';
import Landing from '../Landing';
import SignUp from '../SignUp';
import Dashboard from '../Dashboard';
import Home from '../Home';

import * as ROUTES from '../../constants/routes';

class App extends React.Component {
   constructor(props) {
       super(props);

       this.state = ({authUser: null});
   }

   componentDidMount() {
      this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });
   }

   render() {
     (
       <div>
           <h1>App</ h1>
           <Router>
               <Navigation authUser={this.state.authUser}>
	       <Route exact path={ROUTES.LANDING} component={Landing} />
               <Route path={ROUTES.SIGN_UP} component={SignUp} />
	       <Route path={ROUTES.DASHBOARD} component={Dashboard} />
           </ Router>
      </ div>
     )
   }
}
 
export default App;
