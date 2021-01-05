import React, { Component } from 'react';
import Header from '../../components/Header.js';
import Chat from '../../components/CreateTag/Chat.js';
import Trans from '../../translation/Trans.js';

class Description extends Component {

    render() {
        return (
            <>
                <Header title={Trans.DESC_TITLE} history={this.props.history} />
                <Chat
                    messagess={this.props.preserveDescription}
                    onMassagesChange={this.props.onMassagesChange}
                    userId={this.props.userId}
                />
            </>
        );
    }
}

export default Description;
