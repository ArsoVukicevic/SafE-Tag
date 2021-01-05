import React, { Component } from 'react';

import { List, Card } from 'react-native-paper';
import { ScrollView, SafeAreaView, Image, StyleSheet } from 'react-native';
import { IMAGES_PATH } from '../../constants/common';
import RenderHandler from '../RenderHandler';
import Header from '../../components/Header.js';
import Trans from '../../translation/Trans';

class Location extends Component {

    constructor(props) {
        super(props);

        if (props.list == null) {
            props.getItemTreeAction();
        }

        this.state = {
            selectedItem: props.selectedItem,
            selectedImage: props.selectedImage,
        };

        this.renderContent = this.renderContent.bind(this);
    }

    _handlePressFolder = (list) => {
        list.expanded = !list.expanded;
        this.setState({
            selectedItem: list.key,
            selectedImage: list.image,
        });
    }
    _handlePress = (list) => {
        this.setState({
            selectedItem: this.state.selectedItem === list.key ? null : list.key,
            selectedImage: this.state.selectedItem === list.key ? null : list.image,
        });
    }


    renderList(list) {
        if (!list.hasOwnProperty('expanded')) {
            list.expanded = false;
        }

        return (
            list.nodes.length > 0 ?
                <List.Accordion
                    key={list.key}
                    title={list.name}
                    left={props =>
                        <List.Icon {...props}
                            color={'black'}
                            icon={this.state.selectedItem === list.key ? 'checkbox-blank-circle' : 'checkbox-blank-circle-outline'}
                        />}
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{ paddingLeft: list.level * 20, backgroundColor: this.state.selectedItem === list.key ? 'lightgray' : 'white' }}
                    expanded={list.expanded}
                    titleStyle={style.blackText}
                    onPress={this._handlePressFolder.bind(this, list)}

                >
                    {
                        list.nodes.map(node => (
                            this.renderList(node)
                        ))
                    }
                </List.Accordion>
                :
                <List.Item
                    title={list.name}
                    key={list.key}
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{ paddingLeft: list.level * 20 + 10, backgroundColor: this.state.selectedItem === list.key ? 'lightgray' : 'white' }}
                    onPress={this._handlePress.bind(this, list)}
                    titleStyle={style.blackText}
                    left={props =>
                        <List.Icon {...props}
                            color={'black'}
                            icon={this.state.selectedItem === list.key ? 'checkbox-blank-circle' : 'checkbox-blank-circle-outline'}
                        />}
                />
        );
    }

    renderContent() {
        return (
            <>
                <Header title={Trans.LOCATION_TITLE} history={this.props.history} />
                <Card style={style.container}>
                    <SafeAreaView style={style.scrollContainer}>
                        <ScrollView >
                            <Card>
                                <List.Section >
                                    {this.props.list.map(location => this.renderList(location))}
                                </List.Section>
                            </Card>
                        </ScrollView>
                    </SafeAreaView>

                    {
                        this.state.selectedImage
                        &&
                        <Image
                            style={style.image}
                            source={{ uri: IMAGES_PATH + this.state.selectedImage }}
                        />
                    }

                </Card>
            </>
        );
    }

    componentWillUnmount() {
        this.props.callbackFunc({
            preserveLocation: {
                list: this.props.list,
                selectedItem: this.state.selectedItem,
                selectedImage: this.state.selectedImage,
            },
        });
    }

    render() {
        return <RenderHandler
            value={this.props.list}
            error={this.props.serverError}
            renderFunction={this.renderContent}
        />;
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: 'green',
    },
    scrollContainer: {
        flex: 2,
    },
    image: {
        margin: 20,
        flex: 1,
    },
    blackText: {
        color: 'black',
    },
});

export default Location;
