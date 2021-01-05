import React from 'react';
import Loading from './Loading';
import { Text, Card } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

const RenderHandler = ({ value, error, renderFunction }) => {
    if (value !== null) {
        return renderFunction();
    } else if (error === null) {
        return <Loading />;
    } else {
        return (
            <View style={style.MainContainer}>
                <Card style={style.CardContainer}>
                    <Card.Content><Text style={style.danger}>{error}</Text></Card.Content>
                </Card>
            </View>
        );
    }
};

export default RenderHandler;
const style = StyleSheet.create({
    MainContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(120, 120, 120, 0.3)',
    },
    CardContainer: {
        flexDirection: 'row',
        padding: 5,
        margin: 15,
        fontSize: 20,
        borderWidth: 2,
        borderColor: 'red',
    },
    danger: {
        color: 'red',
    },
});
