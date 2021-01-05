import React, { Component } from 'react';
import { connect } from 'react-redux';

import { StyleSheet, View } from 'react-native';
import { Switch, Route } from 'react-router-native';
import AssignTag from '../../components/OpenTags/AssignTag.js';
import Tags from '../../components/OpenTags/Tags.js';
import { uploadImgAction } from '../App/reducer';
import { Snackbar } from 'react-native-paper';
import { getOpenTagsAction, getOpenTagsDetailsAction, getEmployeesAction, assignTagAction } from './reducer.js';
import Header from '../../components/Header.js';
import { ROUTES, MSG_TYPE } from '../../constants/common.js';
import ImgUpload from '../../utils/ImgUpload.js';
import Trans from '../../translation/Trans.js';


const actionsToProps = dispatch => ({
    getOpenTagsAction: (payload) => dispatch(getOpenTagsAction(payload)),
    getOpenTagsDetailsAction: (payload) => dispatch(getOpenTagsDetailsAction(payload)),
    getEmployeesAction: (payload) => dispatch(getEmployeesAction(payload)),
    assignTagAction: (payload) => dispatch(assignTagAction(payload)),
    uploadImgAction: (payload) => dispatch(uploadImgAction(payload)),
});

const stateToProps = state => ({
    serverError: state.openTags.get('serverError'),
    openTags: state.openTags.get('openTags'),
    selectedTag: state.openTags.get('selectedTag'),
    openTagDetails: state.openTags.get('openTagDetails'),
    employees: state.openTags.get('employees'),
    assinTagError: state.openTags.get('assinTagError'),
    assinTagSuccess: state.openTags.get('assinTagSuccess'),
    user: state.app.get('user'),
});
class OpenTags extends Component {
    constructor() {
        super();
        this.state = {
            alert: {
                visible: false,
            },
        };

        this.assignTag = (payload) => {
            const imgUpload = new ImgUpload();
            imgUpload.uploadImage(
                payload.msgs.filter(msg => msg.type === MSG_TYPE.IMAGE),
                this.props.uploadImgAction
            );
            payload.history = this.props.history;
            this.props.assignTagAction(payload);

        };
    }



    componentDidUpdate(prevProps, prevState) {
        if (this.props.assinTagError !== null && prevProps.assinTagError == null) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                alert: {
                    color: 'red',
                    visible: true,
                    message: this.props.assinTagError,
                },
            });
        }
        else if (this.props.assinTagSuccess && !prevProps.assinTagSuccess) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                alert: {
                    color: 'green',
                    visible: true,
                    message: 'Tag is successfuly assigned',
                },
            });
        }
    }
    render() {
        return (
            <>
                <Header title={Trans.OPEN_TAG_TITLE} {...this.props} />
                <Switch>
                    <Route path={`${ROUTES.HOME.OPEN_TAGS.ASSIGN_TAG}/:tagId`} render={
                        (props) =>
                            <AssignTag
                                {...props}
                                employees={this.props.employees}
                                getEmployees={this.props.getEmployeesAction}
                                assignTag={this.assignTag}
                                serverError={this.props.serverError}
                                tag={this.props.openTagDetails}
                                getOpenTagsDetailsAction={this.props.getOpenTagsDetailsAction}
                                user={this.props.user}
                            />
                    } />
                    <Route path={ROUTES.HOME.OPEN_TAGS.ROOT} render={(props) =>
                        <View style={style.container}>

                            <Tags
                                serverError={this.props.serverError}
                                action={this.props.getOpenTagsAction}
                                tags={this.props.openTags}
                                selectedPath={ROUTES.HOME.OPEN_TAGS.ASSIGN_TAG}
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
                        </View>
                    } />
                </Switch>
            </>

        );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
});
export default connect(stateToProps, actionsToProps)(OpenTags);
