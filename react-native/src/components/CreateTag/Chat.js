import React, { Component } from 'react';
import ImagePicker from 'react-native-image-picker';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
} from 'react-native';
import { MSG_TYPE, IMAGES_PATH } from '../../constants/common';
import { Dialog, Avatar, Card } from 'react-native-paper';
import OfflineNotice from '../OfflineNotice';

const options = {
    title: 'Insert photo',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

/**
 * Parent props list:
 * atribute: messages
 * func: onMassagesChange
 */
export default class Chat extends Component {

    constructor(props) {
        super(props);

        this.state = {
            massage: '',
            messages: props.messagess,
            choseImage: false,
            selectedImage: null,
        };

        this.addMessageOut = () => {
            const time = new Date().getTime();
            let messages = Array.from(this.state.messages);

            const message = {
                type: MSG_TYPE.TEXT,
                message: this.state.massage,
                date: this.getDateTime(time),
                id: time,
                ui: this.props.userId,
            };

            messages.push(message);

            this.props.onMassagesChange(message);

            this.setState({
                messages,
                massage: '',
            });
        };

        this.addMessageIn = (msg) => {
            let messages = Array.from(this.state.messages);

            if (Array.isArray(msg)) {
                msg.forEach(m => messages.push(m));
            } else {
                messages.push(msg);
            }

            this.setState({ messages });
        };

        this.addImage = (image) => {
            const date = new Date();
            const imageName = this.props.userId + '_' + date.getTime() + '.' + image.type.split('/')[1];
            let messages = Array.from(this.state.messages);

            const message = {
                type: MSG_TYPE.IMAGE,
                message: imageName,
                uri: image.uri,
                size: image.fileSize,
                mimeType: image.type,
                id: date.getTime(),
                ui: this.props.userId,
            };

            messages.push(message);

            this.props.onMassagesChange(message);

            this.setState({
                messages,
            });
        };

        this.selectImage = () => {
            this.setState({
                choseImage: true,
            });
        };
        this.closeImage = () => {
            this.setState({
                selectedImage: null,
            });
        };
        this.perviewImage = (item) => {
            this.setState({
                selectedImage: item,
            });
        };
    }

    getDateTime(time) {
        const date = new Date(time);
        var TimeType, hour, minutes;
        hour = date.getHours();
        TimeType = hour <= 11 ? 'am' : 'pm';

        if (hour > 12) {
            hour = hour - 12;
        }
        if (hour === 0) {
            hour = 12;
        }

        minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = '0' + minutes.toString();
        }

        return hour.toString() + ':' + minutes.toString() + ' ' + TimeType.toString();

    }

    renderDate = (date) => {
        return (
            <Text style={styles.time}>
                {date}
            </Text>
        );
    }

    renderText = (item) => {
        let inMessage = item.ui !== this.props.userId;
        let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
        return (
            <View style={[styles.item, itemStyle]}>
                {!inMessage && this.renderDate(item.date)}

                <View style={[styles.balloon]}>
                    <Text>{item.message}</Text>
                </View>

                {inMessage && this.renderDate(item.date)}
            </View>
        );
    }

    renderImg = (item) => {
        let inMessage = item.ui !== this.props.userId;
        let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
        const uri = item.hasOwnProperty('uri')
            ? item.uri
            : IMAGES_PATH + item.message;
        return (
            <View style={itemStyle}>
                <TouchableOpacity onPress={this.perviewImage.bind(this, item)}>
                    <Image
                        source={{ uri: uri }}
                        // resizeMode="contain"
                        style={styles.image} />
                </TouchableOpacity>
            </View >
        );
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} enabled>
                {
                    !!this.props.offline && <OfflineNotice />
                }
                <Card style={styles.container} >
                    <View
                        style={styles.flex_8}>

                        <FlatList
                            style={styles.list}
                            data={this.state.messages}
                            keyExtractor={item => '' + item.id}
                            ref={(ref) => { this.flatListRef = ref; }}
                            onContentSizeChange={() => this.flatListRef.scrollToEnd({ animated: true })}
                            onLayout={() => this.flatListRef.scrollToEnd({ animated: true })}
                            renderItem={({ item }) => {
                                return (
                                    item.type === MSG_TYPE.TEXT
                                        ? this.renderText(item)
                                        : this.renderImg(item)

                                );
                            }} />
                    </View>

                    <Card.Actions style={styles.flex_1}>
                        <TextInput style={styles.inputs}

                            value={this.state.massage}
                            placeholder="Write a message..."
                            underlineColorAndroid="transparent"
                            onChangeText={(massage) => {
                                this.setState({ massage });
                            }}
                        />
                        {/* Send button */}
                        {
                            !this.props.offline && (
                                <TouchableOpacity style={styles.btnSend} onPress={this.addMessageOut}>
                                    <Avatar.Icon icon="send" size={36} />
                                </TouchableOpacity>
                            )

                        }

                        {/* Image open dialog */}
                        {
                            !this.props.offline && (
                                <TouchableOpacity style={styles.btnSend} onPress={this.selectImage}>
                                    <Avatar.Icon icon="image-plus" size={36} />
                                </TouchableOpacity>
                            )
                        }
                    </Card.Actions>

                    {
                        this.state.choseImage &&
                        ImagePicker.showImagePicker(options, (response) => {
                            this.setState({
                                choseImage: false,
                            });
                            if (response.didCancel) {
                                console.log('User cancelled image picker');
                            } else if (response.error) {
                                console.log('ImagePicker Error: ', response.error);
                            } else if (response.customButton) {
                                console.log('User tapped custom button: ', response.customButton);
                            } else {
                                // You can also display the image using data:
                                // const source = {uri: 'data:image/jpeg;base64,' + response.data };
                                this.addImage(response);
                            }
                        })
                    }



                    <Dialog visible={this.state.selectedImage != null} onDismiss={this.closeImage} style={styles.canvas}>
                        <Dialog.Content style={styles.flex} >
                            <Image
                                // resizeMode="contain"
                                source={{
                                    uri: this.state.selectedImage
                                        ? this.state.selectedImage.uri !== undefined
                                            ? this.state.selectedImage.uri
                                            : IMAGES_PATH + this.state.selectedImage.message
                                        : null,

                                }}
                                style={styles.flex}
                            />
                        </Dialog.Content>
                    </Dialog>
                </Card>
            </KeyboardAvoidingView >

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flex_8: {
        flex: 8,
    },
    flex_1: {
        flex: 1,
    },
    container1: {
        position: 'absolute',
        bottom: 0,
    },
    list: {
        padding: 17,
    },
    footer: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#eeeeee',
        paddingHorizontal: 10,
        padding: 10,
    },
    btnSend: {
        width: 40,
        height: 40,
        borderRadius: 360,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconSend: {
        width: 30,
        height: 30,
        alignSelf: 'center',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        borderRadius: 30,
        borderBottomWidth: 1,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    inputs: {
        height: 40,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    balloon: {
        maxWidth: 250,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 20,
    },
    itemIn: {
        alignSelf: 'flex-start',
        alignContent: 'flex-start',
        backgroundColor: '#fdf5e6',
        marginVertical: 5,

    },
    itemOut: {
        alignSelf: 'flex-end',
        alignContent: 'flex-end',
        backgroundColor: '#FFFFFF',
        marginVertical: 5,

    },
    time: {
        alignSelf: 'flex-end',
        fontSize: 12,
        color: '#808080',
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#eeeeee',
        borderRadius: 300,
        padding: 10,
    },
    canvas: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#F5FCFF',
    },
    flex: {
        flex: 1,
    },
    image: {
        width: 200,
        height: 150,
    },
});
