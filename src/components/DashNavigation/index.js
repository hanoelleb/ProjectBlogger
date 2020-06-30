import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import styles from '../Styles/blog.module.css'

const DashNav = () => (
        <div className={styles.nav}>
	    <input type='text' placeholder='Search Soapbox'></input>
            <ul>
	        <li><Link to={ROUTES.DASHBOARD}>Dashboard</Link></li>
                <li><Link to={ROUTES.EXPLORE}>Explore</Link></li>
                <li><Link to={ROUTES.MESSAGES}>Messages</Link></li>
                <li><Link to={ROUTES.FOLLOWERS}>Followers</Link></li>
                <li><Link to={ROUTES.FOLLOWING}>Following</Link></li>
                <li><Link to={ROUTES.NOTIFICATIONS}>Notifications</Link></li>
                <li>Settings</li>
            </ul>
        </div>
    )

export default DashNav;
