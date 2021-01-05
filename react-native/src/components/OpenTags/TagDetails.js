import React, { Component } from 'react';
import { Avatar, Card, Title, Paragraph, Button } from 'react-native-paper';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';

import { getColorForPercentage } from '../../utils/colors';
import { IMAGES_PATH } from '../../constants/common';
import RenderHandler from '../RenderHandler';
import Trans from '../../translation/Trans';

export default class TagDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: false,
        };

        this.renderContent = this.renderContent.bind(this);
    }

    renderContent = () => {
        return (
            <Card style={style.card}>
                <Card.Title title={'Tag #' + this.props.tag.tagId} subtitle={Trans.TAG_DETAILS_RISK_LEVEL + this.props.tag.risk} left={(props) =>
                    <Avatar.Icon {...props} style={{ backgroundColor: getColorForPercentage(this.props.tag.risk / 100) }} icon="tag-outline" />}
                    right={
                        (props) =>
                            this.props.resolvedButton &&
                            <Button
                                mode="contained"
                                color="green"
                                style={style.resolved}
                                onPress={this.props.resolvedButton}>
                                {Trans.TAG_DETAILS_BTN_RESOLVE}
                            </Button>
                    } />

                <SafeAreaView style={style.scrollContainer} >
                    <ScrollView >
                        <Card.Content>
                            <Paragraph>{`${Trans.TAG_DETAILS_REPORTED_BY}: ${this.props.tag.createdBy.name} (${this.props.tag.createdBy.role})`}</Paragraph>
                            <Paragraph>{`${Trans.TAG_DETAILS_ASSIGNED_TO}: ${this.props.tag.assignToUser}`}</Paragraph>
                            <Title>{Trans.TAG_DETAILS_CLASSIFICATION}</Title>
                            <Paragraph>{this.props.tag.classification.map((c, i) => (
                                i !== 0 ? ' -> ' + c : c
                            ))}</Paragraph>

                            <Title>{Trans.TAG_DETAILS_LOCATION}</Title>
                            <Paragraph>{this.props.tag.location.map((l, i) => (
                                i !== 0 ? ' -> ' + l : l
                            ))}</Paragraph>
                        </Card.Content>
                        <Card.Cover source={{ uri: IMAGES_PATH + this.props.tag.locationImg }} />
                        <Card.Content>
                            <Title>{Trans.TAG_DETAILS_DESC}</Title>
                            {
                                this.props.tag.description.map(desc => (
                                    desc.type === 1 ?
                                        <Paragraph key={Math.floor(Math.random() * 1000)} style={style.content}>{desc.msg}</Paragraph>
                                        :
                                        <Card.Cover key={Math.floor(Math.random() * 1000)} style={style.content} source={{ uri: IMAGES_PATH + desc.msg }} />
                                ))
                            }
                        </Card.Content>
                    </ScrollView>
                </SafeAreaView>
                {this.props.children}
            </Card >
        );
    }

    componentDidMount() {
        //Get tag id from url for which details is requested
        const tagId = this.props.match.params.tagId;

        //If tag details is null or
        //If previous tag is differend from requested tag
        if (this.props.tag == null ||
            (this.props.tag != null && this.props.tag.tagId !== tagId)) {
            this.props.getOpenTagsDetailsAction(tagId);
        }
    }

    render() {
        return (
            <RenderHandler
                value={this.props.tag}
                error={this.props.serverError}
                renderFunction={this.renderContent}
            />
        );
    }
}

const style = StyleSheet.create({
    card: {
        flex: 1,
    },
    actions: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        justifyContent: 'center',
    },
    scrollContainer: {
        flex: 1,
        marginBottom: 50,
    },
    content: {
        margin: 10,
    },
    resolved: {
        marginRight: 10,
    },
});
