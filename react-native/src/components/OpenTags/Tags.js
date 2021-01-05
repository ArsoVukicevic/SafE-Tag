import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import CustomButton from '../CustomButton';
import { getColorForPercentage } from '../../utils/colors';
import RenderHandler from '../RenderHandler';
import { Subheading } from 'react-native-paper';

export default class Tags extends Component {

    componentDidMount() {
        this.props.action();
    }

    renderContent = () => {
        return (
            <SafeAreaView style={style.scrollContainer} >
                <ScrollView >
                    <View style={style.container}>
                        {
                            this.props.tags.map(tag =>
                                <CustomButton
                                    imgName={`class-type-${tag.classificationType}`}
                                    label={'Tag #' + tag.id}
                                    key={tag.id}
                                    bgColor={getColorForPercentage(tag.risk)}
                                    path={this.props.selectedPath + '/' + tag.id}
                                >
                                    <Subheading numberOfLines={1} style={{ marginStart: 10 }}>{tag.classification}</Subheading>
                                    <Subheading numberOfLines={1} style={{ marginStart: 10 }}>{tag.location}</Subheading>
                                    <Subheading numberOfLines={1} style={{ marginStart: 10 }}>{`Risk Level: ${tag.risk * 100}`}</Subheading>
                                    {tag.assignToUser &&
                                        <Subheading numberOfLines={1} style={{ marginStart: 10 }}>{tag.assignToUser}</Subheading>
                                    }
                                </CustomButton>
                            )
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    render() {
        return (
            <RenderHandler
                value={this.props.tags}
                error={this.props.serverError}
                renderFunction={this.renderContent}
            />
        );
    }
}

const style = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        padding: 10,
    },
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',

    },
});
