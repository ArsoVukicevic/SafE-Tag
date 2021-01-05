import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chat from '../CreateTag/Chat';
import { MSG_TYPE } from '../../constants/common';
import ImgUpload from '../../utils/ImgUpload';
import { uploadImgAction } from '../../containers/App/reducer';
import NetInfo from '@react-native-community/netinfo';
import ChatRepository from '../../db/Repository/ChatRepository';
import RenderHandler from '../RenderHandler';

const actionsToProps = dispatch => ({
    uploadImgAction: (payload) => dispatch(uploadImgAction(payload)),
});

const stateToProps = state => ({
    user: state.app.get('user'),
    ws: state.app.get('ws'),
    wsMsgReceived: state.app.get('wsMsgReceived'),
    imageUploaded: state.app.get('imageUploaded'),
});

/**
 * Parent props list:
 * func: onMessage
 */
class TaskToDoChat extends Component {

    constructor(props) {
        super(props);

        this.state = {
            messagess: null,
            offlineMode: null,
            dbError: null,
        };

        const uriParams = JSON.parse(props.uriParams);
        this.topic = 'tag_' + uriParams.tId;
        this.toUser = uriParams.toUser;
        this.chatRef = null;
        this.imgUpload = new ImgUpload();
        this.postponeMsgSend = [];
        this.netInfoUnsubscribe = null;
        this.notificationMsg = uriParams.m;
    }

    onMassagesChange = (message) => {
        if (message.type === MSG_TYPE.IMAGE) {
            //uploadimage
            const requestId = Date.now();
            this.imgUpload.uploadImage([message], this.props.uploadImgAction, requestId);
            this.postponeMsgSend[requestId] = message;
        } else {
            this._wsSend({ cmd: 'msg', m: message, t: this.topic, toUser: this.toUser });
            this._insertMsgInDb(message);
        }
    }

    _wsSend(data) {
        this.props.ws !== null
            && this.props.ws.send(JSON.stringify(data));
    }

    _addMessage(msg) {
        const msgObj = JSON.parse(msg);
        this.chatRef.addMessageIn(msgObj);
        this._insertMsgInDb(msgObj);
    }

    _insertMsgInDb(msg) {
        if (Array.isArray(msg)) {
            msg.forEach(m => {
                const dataParams = {
                    id: m.id,
                    topic: this.topic,
                    msgTime: m.date,
                    user: m.ui,
                    msg: m.message,
                    msgType: m.type,
                };
                ChatRepository.insert(dataParams);
            });
        } else {
            const dataParams = {
                id: msg.id,
                topic: this.topic,
                msgTime: msg.date,
                user: msg.ui,
                msg: msg.message,
                msgType: msg.type,
            };
            ChatRepository.insert(dataParams);
        }
    }

    //load messagess from DB
    _loadMessagessAndSubscribe() {
        ChatRepository.getAllMsgByTopic(this.topic).then((messagess) => {
            this.notificationMsg && messagess.push(this.notificationMsg);
            this._subscribeOnTopic(messagess.length);
            this.setState({ messagess });
        }).catch(() => {
            this.setState({ dbError: 'Db connection error!' });
        });
    }

    _subscribeOnTopic(msgCount) {
        this._wsSend({ cmd: 'sub', t: this.topic, u: this.props.user.id, msgCount: msgCount });
    }

    _unsubscribeOnTopic() {
        this._wsSend({ cmd: 'unsub' });
    }

    renderContent = () => {
        return (
            <Chat
                offline={this.state.offlineMode}
                ref={ref => { this.chatRef = ref; }}
                messagess={this.state.messagess}
                userId={this.props.user.id}
                onMassagesChange={this.onMassagesChange}
            />
        );
    }

    componentDidMount() {
        // Subscribe
        this.netInfoUnsubscribe = NetInfo.addEventListener(state => {
            this.setState({ offlineMode: !state.isConnected });
        });

        this._loadMessagessAndSubscribe();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.ws === null && this.props.ws !== null) {
            this._loadMessagessAndSubscribe();
        }

        if (prevProps.wsMsgReceived !== this.props.wsMsgReceived) {
            this._addMessage(this.props.wsMsgReceived);
        }

        if (prevProps.imageUploaded === null
            && this.props.imageUploaded !== null
            && this.props.imageUploaded !== -1) {

            const postponedMsg = this.postponeMsgSend[this.props.imageUploaded];
            const myMsg = {
                type: postponedMsg.type,
                message: postponedMsg.message,
                id: postponedMsg.id,
                ui: this.props.user.id,
            };
            this._wsSend({ cmd: 'msg', m: myMsg, t: this.topic, toUser: this.toUser });
            this._insertMsgInDb(myMsg);
        }
    }

    componentWillUnmount() {
        this._unsubscribeOnTopic();
        // Unsubscribe
        this.netInfoUnsubscribe();
    }

    render() {
        return (
            <RenderHandler
                value={this.state.messagess}
                error={this.state.dbError}
                renderFunction={this.renderContent}
            />
        );
    }
}

export default connect(stateToProps, actionsToProps)(TaskToDoChat);
