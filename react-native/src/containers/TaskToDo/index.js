import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View, StyleSheet, Text } from 'react-native';
import TagDetails from '../../components/OpenTags/TagDetails.js';
import { Switch, Route, Redirect } from 'react-router-native';
import Tags from '../../components/OpenTags/Tags.js';
import CustomButton from '../../components/CustomButton.js';
import centarConStyles from '../../assets/styles/CentarContainer.js';

import { Link } from 'react-router-native';
import { Card, Button, Snackbar } from 'react-native-paper';
import { ROUTES, COLORS } from '../../constants/common.js';
import ROLES from '../../types/Roles.js';
import { getTaskToDoAction, resolveTagAction } from './reducer.js';
import { getOpenTagsDetailsAction, getTagsCountAction } from '../OpenTags/reducer.js';
import TaskToDoChat from '../../components/TaskToDo/TaskToDoChat.js';
import Header from '../../components/Header.js';
import CheckDialog from '../../components/TaskToDo/CheckDialog.js';
import Trans from '../../translation/Trans.js';

const actionsToProps = dispatch => ({
    getTaskToDoAction: (payload) => dispatch(getTaskToDoAction(payload)),
    getTagsCountAction: (payload) => dispatch(getTagsCountAction(payload)),
    getOpenTagsDetailsAction: (payload) => dispatch(getOpenTagsDetailsAction(payload)),
    resolveTagAction: (payload) => dispatch(resolveTagAction(payload)),
});

const stateToProps = state => ({
    user: state.app.get('user'),
    serverErrorOpenTag: state.openTags.get('serverError'),
    serverErrorTaskToDo: state.taskToDo.get('serverError'),
    taskToDo: state.taskToDo.get('taskToDo'),
    taskToDoDetails: state.taskToDo.get('taskToDoDetails'),
    resolveError: state.taskToDo.get('resolveError'),
    resolveSuccess: state.taskToDo.get('resolveSuccess'),

    taskToDoCountOnMe: state.openTags.get('taskToDoCountOnMe'),
    taskToDoCountByMe: state.openTags.get('taskToDoCountByMe'),
});

class TaskToDo extends Component {
    constructor() {
        super();

        this.state = {
            alert: {
                visible: false,
            },
        };

        this.checkDialogRef = null;

        this.getTagsAssignByMe = () => {
            this.props.getTaskToDoAction(true);
        };

        this.getTagsAssignOnMe = () => {
            this.props.getTaskToDoAction(false);
        };

        this.resolveTagDialog = () => {
            this.checkDialogRef.showDialog();
        };

        this.onResolveConfirme = () => {
            this.props.resolveTagAction({
                tag: this.props.taskToDoDetails.tagId,
                callback: this.props.history.go,
            });
        };
    }

    renderContent() {
        return this.props.user.role === ROLES.MANAGER
            ? (
                <View style={centarConStyles.container} >
                    <CustomButton
                        imgName="openTags"
                        label={Trans.TASK_TODO_ASSIGN_ON_ME}
                        key="on-me"
                        bgColor={COLORS.blue}
                        path={`${ROUTES.HOME.TASK_TODO.TASKS}/0`}
                        count={this.props.taskToDoCountOnMe}
                    />

                    <CustomButton
                        imgName="openTags"
                        label={Trans.TASK_TODO_ASSIGN_BY_ME}
                        key="to-me"
                        bgColor={COLORS.blue}
                        path={`${ROUTES.HOME.TASK_TODO.TASKS}/1`}
                        count={this.props.taskToDoCountByMe}
                    />

                    <Snackbar
                        visible={this.state.alert.visible}
                        onDismiss={() => this.setState({ alert: { visible: false } })}
                        duration={3000}
                        style={{
                            backgroundColor: this.state.alert.color,
                        }}
                    >
                        {this.state.alert.message}
                    </Snackbar>
                </View >
            )
            : <Redirect to={`${ROUTES.HOME.TASK_TODO.TASKS}/0`} />;
    }


    componentDidUpdate(prevProps, prevState) {

        if (this.props.resolveError !== null && prevProps.resolveError == null) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                alert: {
                    color: 'red',
                    visible: true,
                    message: this.props.resolveError,
                },
            });
        }
        else if (this.props.resolveSuccess && !prevProps.resolveSuccess) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                alert: {
                    color: 'green',
                    visible: true,
                    message: 'Task is successfuly resolved',
                },
            });
        }
    }

    render() {
        const headerTitle = (this.props.taskToDoDetails && this.props.history.location.pathname.includes(ROUTES.HOME.TASK_TODO.CORRESPODENCE))
            ? `${this.props.taskToDoDetails.toUserName} (${this.props.taskToDoDetails.toUserRole})`
            : Trans.TASK_TODO_TITLE
        const correspodenceParams = this.props.taskToDoDetails
            && JSON.stringify({ tId: this.props.taskToDoDetails.tagId, toUser: this.props.taskToDoDetails.toUser });
        const showCorrespodence = this.props.taskToDoDetails
            && this.props.taskToDoDetails.toUser !== null
            && this.props.taskToDoDetails.assignToUserId !== this.props.taskToDoDetails.taskManager;
        return (
            <>
                <Header title={headerTitle} {...this.props} />
                <Switch>
                    <Route path={`${ROUTES.HOME.TASK_TODO.CORRESPODENCE}/:uriParams`} render={
                        (props) =>
                            <TaskToDoChat
                                uriParams={props.match.params.uriParams}
                            />
                    } />

                    <Route path={`${ROUTES.HOME.TASK_TODO.TASKS}/:assignByMe`} render={
                        (props) =>
                            <Tags
                                serverError={this.props.serverErrorTaskToDo}
                                action={props.match.params.assignByMe === '1' ? this.getTagsAssignByMe : this.getTagsAssignOnMe}
                                tags={this.props.taskToDo}
                                selectedPath={ROUTES.HOME.TASK_TODO.TASKS_DETAILS} />
                    } />

                    <Route path={`${ROUTES.HOME.TASK_TODO.TASKS_DETAILS}/:tagId`} render={
                        (props) =>
                            <>
                                <TagDetails
                                    serverError={this.props.serverErrorOpenTag}
                                    {...props}
                                    resolvedButton={this.props.user.role === ROLES.MANAGER ? this.resolveTagDialog : null}
                                    tag={this.props.taskToDoDetails}
                                    getOpenTagsDetailsAction={this.props.getOpenTagsDetailsAction}
                                >
                                    {showCorrespodence &&
                                        <Card.Actions style={style.actions}>
                                            <Link to={`${ROUTES.HOME.TASK_TODO.CORRESPODENCE}/${correspodenceParams}`} >
                                                <Button mode="contained" >{Trans.TASK_TODO_SEE_CHAT}</Button>
                                            </Link>
                                        </Card.Actions >
                                    }
                                </TagDetails>
                                <CheckDialog
                                    ref={ref => { this.checkDialogRef = ref; }}
                                    onOk={this.onResolveConfirme}
                                    dialogContent="Confirm that you want to resolve task!"
                                    dialogTitle="Resolve Task!"
                                />
                            </>
                    } />

                    <Route path={ROUTES.HOME.TASK_TODO.ROOT} render={(props) => this.renderContent()} />

                </Switch>
            </>
        );
    }
}

const style = StyleSheet.create({

    actions: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        justifyContent: 'center',
    },
});
export default connect(stateToProps, actionsToProps)(TaskToDo);
