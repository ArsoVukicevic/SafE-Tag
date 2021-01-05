import React, { Component } from 'react';

import { List, Card, FAB, Portal } from 'react-native-paper';
import { ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import RenderHandler from '../RenderHandler';
import Header from '../../components/Header.js';
import imgPath from '../../utils/img';
import Trans from '../../translation/Trans';

class Classification extends Component {

    constructor(props) {
        super(props);
        if (props.list == null) {
            props.getClassificationTreeAction();
        }
        this.state = {
            fabOpen: false,
            classificationId: props.classificationId,
            selectedItem: props.selectedItem,
        };

        this.getClassification = this.getClassification.bind(this);
        this.renderContent = this.renderContent.bind(this);
    }

    getClassification() {
        if (this.state.classificationId in this.props.list) {
            return this.props.list[this.state.classificationId];
        } else {
            return [];
        }
    }

    _handlePressFolder = (list) => {
        list.expanded = !list.expanded;
        this.setState({
            selectedItem: list.key,
        });
    }
    _handlePress = (key) => {
        this.setState({
            selectedItem: this.state.selectedItem === key ? null : key,
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
                    titleNumberOfLines={2}
                    title={list.name}
                    key={list.key}
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{ paddingLeft: list.level * 20 + 10, backgroundColor: this.state.selectedItem === list.key ? 'lightgray' : 'white' }}
                    onPress={this._handlePress.bind(this, list.key)}
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
        const groupImageKey = `class-type-${this.state.classificationId}`;
        return (
            <React.Fragment>
                <Header title={Trans.CLASSIFICATION_TITLE} history={this.props.history} />
                <Card style={style.container}>
                    <SafeAreaView style={style.scrollContainer}>
                        <ScrollView >
                            <Card>
                                <List.Section >
                                    {this.getClassification().map(c => this.renderList(c))}
                                </List.Section>
                            </Card>
                        </ScrollView>
                    </SafeAreaView>
                </Card>


                <Portal>
                    <FAB.Group
                        open={this.state.fabOpen}
                        icon={imgPath[groupImageKey]}
                        actions={[
                            { label: 'NU', onPress: () => this.setState({ classificationId: 1 }) },
                            { label: 'NP', onPress: () => this.setState({ classificationId: 2 }) },
                            { label: 'NM', onPress: () => this.setState({ classificationId: 3 }) },
                        ]}
                        onStateChange={({ open }) => this.setState({ fabOpen: open })}
                    />
                </Portal>
            </React.Fragment>
        );
    }

    componentWillUnmount() {

        this.props.callbackFunc({
            preserveClassification: {
                list: this.props.list,
                selectedItem: this.state.selectedItem,
                classificationId: this.state.classificationId,
            },
        });
    }

    render() {
        return (
            <RenderHandler
                value={this.props.list}
                error={this.props.serverError}
                renderFunction={this.renderContent}
            />
        );
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
        flex: 1,
    },
    blackText: {
        color: 'black'
    },
});

export default Classification;
