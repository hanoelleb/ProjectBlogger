import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

//search bar
//navbar - explore, messages, followers, notifications, account
//posts

const Dashboard = () => (
    <div>
	<div>
	    <input type='text' placeholder='Search Soapbox'></input>
	</div>
	<div>
	    <ul>
	        <li>Explore</li>
                <li>Messages</li>
                <li>Followers</li>
                <li>Notifications</li>
                <li>Settings</li>
            </ul>
	</div>
        <div>
	    <button>Text Post</button>
            <button>Photo Post</button>
	</div>
    </div>
);

export default Dashboard;
