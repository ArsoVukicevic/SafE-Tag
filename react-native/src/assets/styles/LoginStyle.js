import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F6F6',
    },
    h: {
        height: 60,
        width: '80%',
        marginBottom: 20,
        backgroundColor: 'white',
    },
    ImageTextContainer: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    Image: {
        alignItems: 'flex-start',
    },
    Text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginStart: 15,
    },
    rightContainer: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: 60,
        width: '80%',
    },
    redText: {
        color: 'red',
    },
});

export default styles;
