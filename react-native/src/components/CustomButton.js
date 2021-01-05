import React from 'react';

import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { Link } from 'react-router-native';
import imgPath from '../utils/img.js';
import styles from '../assets/styles/CustomButtonStyle.js';

const CustomButton = ({ imgName, label, labelColor = '#fff', bgColor, path, count, children }) => {
    return (
        <Link to={path} style={[styles.MainContainer, { backgroundColor: bgColor }]} activeOpacity={0.5} >
            <>
                <View style={{ flexDirection: 'column', maxWidth: '70%' }}>
                    <Text style={[styles.TextStyle, { color: labelColor }]}> {label} </Text>
                    {
                        children && children.map(c => c)
                    }
                </View>
                <View style={styles.RightContainer}>
                    <ImageBackground resizeMode="stretch" source={imgPath[imgName]} style={styles.ImgStyle}>
                        {
                            count !== undefined && (
                                <View style={style.icons}>
                                    <Text style={style.countText} >{count}</Text>
                                </View>
                            )
                        }
                    </ImageBackground>
                </View>
            </>
        </Link>
    );
};

export default CustomButton;

const style = StyleSheet.create({
    icons: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    countText: {
        fontWeight: 'bold',
        fontSize: 24,
    },
});
