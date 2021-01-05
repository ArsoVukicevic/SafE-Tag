import React, { Component } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { View } from 'react-native';
import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { logoutAction } from '../containers/App/reducer';
import Trans from '../translation/Trans';

const actionsToProps = dispatch => ({
    logoutAction: (payload) => dispatch(logoutAction(payload)),
});

const stateToProps = state => ({
    user: state.app.get('user'),
});

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    _handleBackPress = () => {
        this.props.history.goBack();
        return true;
    }

    _openMenu = () => this.setState({ visible: true });

    _closeMenu = () => this.setState({ visible: false });

    render() {
        return (
            <View>
                <Appbar.Header dark>
                    <Appbar.BackAction onPress={this._handleBackPress} />
                    <Appbar.Content title={this.props.title} />
                    <Menu
                        visible={this.state.visible}
                        onDismiss={this._closeMenu}
                        anchor={
                            <Appbar.Action
                                color="white"
                                icon={({ size, color }) => (
                                    <Icon name="more-vert" size={size} color={color} />
                                )}
                                onPress={this._openMenu} />
                        }
                    >
                        <Menu.Item icon="logout" onPress={this.props.logoutAction} title={Trans.LOGOUT} />
                        <Menu.Item icon="account" title={this.props.user.fullName} />
                    </Menu>
                </Appbar.Header>

            </View>
        );
    }
}

export default connect(stateToProps, actionsToProps)(Header);
