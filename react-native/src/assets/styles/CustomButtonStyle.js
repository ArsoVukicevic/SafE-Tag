import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    MainContainer: {
        flexDirection: 'row',
        // height: 70,
        minHeight: 70,
        width: '90%',
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',//align everything inside view
    },
    RightContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    TextStyle: {
        fontSize: 22,
        marginStart: 10,
    },
    ImgStyle: {
        flexDirection: 'row',
        height: 50,
        width: 50,
        justifyContent: 'flex-end',
        marginEnd: 10,
    },
});

export default styles;
