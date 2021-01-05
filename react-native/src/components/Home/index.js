import React, { Component } from 'react';
import { View, BackHandler, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-native';
import WS from 'react-native-websocket';

import routes from './routes.js';
import CustomButton from '../CustomButton.js';
import centarConStyles from '../../assets/styles/CentarContainer';
import { setWSAction, onMsgReceivedWSAction } from '../../containers/App/reducer';
import { getTagsCountAction } from '../../containers/OpenTags/reducer';
import Header from '../Header.js';
import { ROUTES } from '../../constants/common.js';
import Trans from '../../translation/Trans.js';

const HomeButton = ({ route, opentTagCount, taskToDoCount }) => {
    switch (route.id) {
        case 3:
            return (
                <CustomButton key={route.id} {...route} count={opentTagCount} />
            );
        case 2:
            return (
                <CustomButton key={route.id} {...route} count={taskToDoCount} />
            );
        default:
            return <CustomButton key={route.id} {...route} />;
    }
};

const HomeContent = ({ userRole, props, opentTagCount, taskToDoCount }) => (
    <>
        <Header title={Trans.HOME_TITLE} {...props} />
        <View style={centarConStyles.container}>
            {
                routes.map(route =>
                    route.roles.includes(userRole) &&
                    route.routes.map(r => {
                        return <HomeButton
                            key={`homeButton_${r.id}`}
                            route={r}
                            opentTagCount={opentTagCount}
                            taskToDoCount={taskToDoCount}
                        />;
                    })
                )
            }
        </View>
    </>
);

const actionsToProps = dispatch => ({
    setWSAction: (payload) => dispatch(setWSAction(payload)),
    onMsgReceivedWSAction: (payload) => dispatch(onMsgReceivedWSAction(payload)),
    getTagsCountAction: (payload) => dispatch(getTagsCountAction(payload)),
});

const stateToProps = state => ({
    user: state.app.get('user'),
    forceOpenCorrespondence: state.app.get('forceOpenCorrespondence'),
    openTagsCount: state.openTags.get('openTagsCount'),
    taskToDoCount: state.openTags.get('homeTaskToDoCount'),
});

class Home extends Component {

    constructor() {
        super();

        this.ws = null;
    }

    renderRoutes = (userRole) => (
        routes.map(route => {
            return route.roles.includes(userRole) &&
                route.routes.map(r =>
                    <Route key={r.id} path={r.path} component={r.component} />
                );
        })
    )

    componentDidMount() {
        (this.props.openTagsCount === null || this.props.taskToDoCount) && this.props.getTagsCountAction();
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.forceOpenCorrespondence !== this.props.forceOpenCorrespondence) {
            const params = JSON.stringify(this.props.forceOpenCorrespondence);
            this.props.history.push(`${ROUTES.HOME.TASK_TODO.CORRESPODENCE}/${params}`);
        }
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    handleBackPress = () => {
        this.props.history.goBack();
        return true;
    }

    render() {
        return (
            <>
                <Switch>
                    {this.renderRoutes(this.props.user.role)}
                    <Route path="/home/content" render={(props) => (
                        <HomeContent
                            props={props}
                            userRole={this.props.user.role}
                            opentTagCount={this.props.openTagsCount}
                            taskToDoCount={this.props.taskToDoCount} />
                    )} />
                    <Redirect from="/home" to="/home/content" />
                </Switch>
                <WS
                    ref={ref => { this.ws = ref; }}
                    url={this.props.user.additionData.ws_host}
                    onOpen={() => {
                        console.log('WS connection establish!');
                        this.props.setWSAction(this.ws);
                    }}
                    onMessage={event => {
                        console.log('WS event.data', event.data);
                        this.props.onMsgReceivedWSAction(event.data);
                    }}
                    onError={event => { console.log('WS onError', event); this.props.setWSAction(null); }}
                    onClose={event => { console.log('WS onClose', event); this.props.setWSAction(null); }}
                    reconnect={true} // Will try to reconnect onClose
                />
            </>
        );
    }
}

const style = StyleSheet.create({
    countText: {
        fontWeight: 'bold',
        fontSize: 24,
    },
});

export default connect(stateToProps, actionsToProps)(Home);


