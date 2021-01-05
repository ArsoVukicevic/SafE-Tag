import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Slider from 'react-native-slider';
import LinearGradient from 'react-native-linear-gradient';
import imgPath from '../../utils/img';
import { Card } from 'react-native-paper';
import Header from '../../components/Header.js';
import Trans from '../../translation/Trans';

class RiskAssessment extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.riskValue,
        };
    }
    componentWillUnmount() {
        this.props.callbackFunc({ preserveRiskValue: Math.round(this.state.value) });
    }

    render() {
        return (
            <>
                <Header title={Trans.RISK_ASSESSMENT_TITLE} history={this.props.history} />
                <View style={style.container} >
                    {/* <Text style={style.title}>
                        Seatbelt Damaged
                    </Text> */}
                    <Card style={style.card}>

                        <Image
                            source={imgPath.severty}
                            resizeMode="stretch"
                            style={style.img}
                        />

                    </Card>
                    <View style={style.sliderContainer} >
                        <Text style={style.text}>{Trans.RISK_ASSESSMENT_RISK_LEVEL}</Text>
                        <Text style={style.text}>{Math.round(this.state.value)}</Text>

                        <LinearGradient
                            // colors={['green', 'yellow', 'red']}
                            colors={['white', 'white']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={style.sliderBackground}
                        >
                            <View>
                                <Slider
                                    style={style.slider}
                                    minimumValue={0}
                                    maximumValue={100}
                                    thumbTintColor={'black'}
                                    minimumTrackTintColor="blue"
                                    maximumTrackTintColor="blue"
                                    onValueChange={value => this.setState({ value })}
                                    value={this.state.value}
                                />
                            </View>
                        </LinearGradient>
                        <View style={style.textContainer}>
                            <Text style={style.low}>{Trans.RISK_ASSESSMENT_LOW}</Text>
                            <Text style={style.high}>{Trans.RISK_ASSESSMENT_HIGH}</Text>
                        </View>

                    </View>
                </View>
            </>
        );
    }
}

const style = StyleSheet.create({
    container: {
        padding: '5%',
        flex: 1,
    },
    sliderContainer: {
        flex: 1,
        paddingTop: 20,
    },
    sliderBackground: {
        width: '100%',
        height: 20,
        borderRadius: 50,
    },
    slider: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
    },

    text: {
        fontSize: 30,
        marginBottom: 15,
        textAlign: 'center',
    },
    low: {
        fontSize: 20,
        width: '50%',
    },
    high: {
        fontSize: 20,
        width: '50%',
        textAlign: 'right',
    },
    textContainer: {
        flexDirection: 'row',
        fontSize: 20,
        width: '100%',
    },
    title: {
        fontSize: 30,
        margin: 5,
    },
    card: {
        height: '60%',
    },
    img: {
        width: '100%',
        height: '100%',
    },
});
export default RiskAssessment;
