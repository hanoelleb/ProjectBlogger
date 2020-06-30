import React from 'react';
import { Link } from 'react-router-dom';

import SignOut from '../SignOut';
import * as ROUTES from '../../constants/routes';
import {AuthUserContext} from '../Session'; 

import styles from '../Styles/lists.module.css';

const Navigation = ({authUser}) => (
    <div className={styles.nav}>
	<AuthUserContext.Consumer>
	    {authUser => authUser ? <NavAuth /> : <NavNonAuth />}
        </AuthUserContext.Consumer>
    </div>
);

const NavAuth = () => (
    <ul>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
      </li>
      <li>
	<Link to={ROUTES.DASHBOARD}>Dashboard</Link>
      </li>
      <li>
        <Link to={ROUTES.ADMIN}>Admin</Link>
      </li>
      <li>
	<SignOut />
      </li>
    </ul>
)


const NavNonAuth = () => (
   <ul>
    <li>
      <Link to={ROUTES.LANDING}>Sign In</Link>
    </li>
    <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
    <li>
      <Link to={ROUTES.ADMIN}>Admin</Link>
    </li>
   </ul>
)
 
export default Navigation;
