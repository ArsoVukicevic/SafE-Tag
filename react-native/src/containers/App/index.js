import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Switch, Redirect } from 'react-router-native';
import OneSignal from 'react-native-onesignal';

import AuthRoute from './AuthRoute.js';
import Login from '../Login';
import Home from '../../components/Home';

import { checkUserAction, forceOpenCorrespondenceAction } from './reducer';
import { incrementOpenTagsCountAction, incrementTaskToDoCountAction, getTagsCountAction } from '../OpenTags/reducer';
import Loading from '../../components/Loading.js';
import { ROUTES } from '../../constants/common.js';
import SplashScreen from 'react-native-splash-screen';

const actionsToProps = dispatch => ({
  checkUserAction: (payload) => dispatch(checkUserAction(payload)),
  incrementOpenTagsCountAction: (payload) => dispatch(incrementOpenTagsCountAction(payload)),
  incrementTaskToDoCountAction: (payload) => dispatch(incrementTaskToDoCountAction(payload)),
  forceOpenCorrespondenceAction: (payload) => dispatch(forceOpenCorrespondenceAction(payload)),
  getTagsCountAction: (payload) => dispatch(getTagsCountAction(payload)),
});

const stateToProps = state => ({
  user: state.app.get('user'),
  loading: state.app.get('loading'),
});

class App extends Component {

  _initOneSignal() {
    OneSignal.init(this.props.user.additionData.one_signal_app_id);
    OneSignal.inFocusDisplaying(2);
    OneSignal.setExternalUserId('safEtag_' + this.props.user.id);
    OneSignal.addEventListener('received', this._onReceived.bind(this));
    OneSignal.addEventListener('opened', this._onOpened.bind(this));
    OneSignal.addEventListener('ids', this._onIds);
  }

  _onReceived(notification) {
    const data = notification.payload.additionalData;
    if (data.hasOwnProperty('tagOpen')) {
      this.props.incrementOpenTagsCountAction();
    }

    if (data.hasOwnProperty('newTaskAssign')) {
      this.props.incrementTaskToDoCountAction();
    }

    if (data.hasOwnProperty('taskResolved')) {
      this.props.getTagsCountAction();
    }
  }

  _onOpened(openResult) {
    const data = openResult.notification.payload.additionalData;
    if (data.hasOwnProperty('newMsg')) {
      this.props.forceOpenCorrespondenceAction(data.newMsg);
    }

    // console.log('Message: ', openResult.notification.payload.body);
    // console.log('Data: ', openResult.notification.payload.additionalData);
    // console.log('isActive: ', openResult.notification.isAppInFocus);
    // console.log('openResult: ', openResult);
  }

  _onIds(device) {
    // console.log('Device info: ', device);
  }

  componentDidMount() {
    this.props.checkUserAction();
    SplashScreen.hide();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user === null && this.props.user !== null) {
      this._initOneSignal();
    }
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this._onReceived.bind(this));
    OneSignal.removeEventListener('opened', this._onOpened);
    OneSignal.removeEventListener('ids', this._onIds);
  }

  render() {
    const isAuth = !!this.props.user;
    return (
      this.props.loading === true
        ? <Loading />
        : <Switch>
          <AuthRoute path={ROUTES.HOME.ROOT} component={Home} isAuth={isAuth} />
          <AuthRoute path={ROUTES.LOGIN} component={Login} redirectPath={ROUTES.HOME.ROOT} isAuth={!isAuth} />
          <Redirect to={ROUTES.LOGIN} />
        </Switch>

    );
  }
}
export default connect(stateToProps, actionsToProps)(App);
