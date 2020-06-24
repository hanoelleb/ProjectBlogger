//so route would be /blogname
import React from 'react';
import {withFirebase} from '../../firebase';

const Other = () => (
    <div>
        <div>
            <input type='text' placeholder='Search Soapbox'></input>
        </div>
        <div>
            <Content />
        </div>
    </div>
)


class ContentBase extends React.Component {
    render() {
        return <h1>Hello</h1>
    }
}

const Content = withFirebase(ContentBase);

export default Other;
