import React from 'react';

import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import styles from '../assets/styles/CustomButtonStyle.js';

const Loading = ({ imgName, label, color, path }) => {
    let background = styles[color];
    if (!background) {
        background = {
            backgroundColor: color,
        };
    }
    return (
        <View style={style.loader}>
            <View style={style.container}>

                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={style.loadingText}>Loading...</Text>
            </View>
        </View>
    );
};

const style = StyleSheet.create({
    loader: {
        flex: 1,
        backgroundColor: 'rgba(120, 120, 120, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        borderRadius: 10,
        backgroundColor: 'white',
        width: '50%',
        padding: 20,
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 20,
        marginTop: 10,
    },
});

export default Loading;
