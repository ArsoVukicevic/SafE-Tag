import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';

export default class CheckDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }


    showDialog = () => this.setState({ visible: true });

    _hideDialog = () => this.setState({ visible: false });

    _onOk = () => {
        console.log('OnOk Click');
        this.props.onOk && this.props.onOk();
        this._hideDialog();
    }

    _onCancel = () => {
        console.log('OnCancel Click');
        this.props.onCancel && this.props.onCancel();
        this._hideDialog();
    }

    render() {
        return (
            <View>
                <Portal>
                    <Dialog
                        visible={this.state.visible}
                        onDismiss={this._hideDialog}>
                        <Dialog.Title>{this.props.dialogTitle}</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>{this.props.dialogContent}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={this._onCancel}>Cancel</Button>
                            <Button onPress={this._onOk}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        );
    }
}
