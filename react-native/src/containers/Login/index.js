import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Image } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';

import imgPath from '../../utils/img';

import { loginAction } from '../App/reducer';
import styles from '../../assets/styles/LoginStyle.js';
import Trans from '../../translation/Trans';

const actionsToProps = dispatch => ({
  loginAction: (payload) => dispatch(loginAction(payload)),
});

const stateToProps = state => ({
  user: state.app.get('user'),
  loginErrorMsg: state.app.get('loginErrorMsg'),
});

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      pass: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    this.props.loginAction(this.state);
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }


  render() {
    return (
      <View style={styles.MainContainer}>

        <View style={styles.ImageTextContainer}>
          <Image style={styles.Image} source={imgPath.employee} />
          <Text style={styles.Text}>SafETag</Text>
        </View>

        <TextInput
          id="email"
          label={Trans.LOGIN_EMAIL_LABEL}
          value={this.state.email}
          mode="outlined"
          style={styles.h}
          onChangeText={email => this.setState({ email })}
        />

        <TextInput
          id="pass"
          label={Trans.LOGIN_PASS_LABEL}
          value={this.state.pass}
          mode="outlined"
          secureTextEntry={true}
          style={styles.h}
          onChangeText={pass => this.setState({ pass })}
        />

        <View style={styles.rightContainer}>
          <Button
            contentStyle={style.loginBtn}
            mode="contained"
            onPress={this.handleSubmit}
          >
            {Trans.LOGIN_BTN}
          </Button>
        </View>

        {this.props.loginErrorMsg && <Title style={styles.redText}>{this.props.loginErrorMsg}</Title>}

      </View>
    );
  }
}

const style = {
  loginBtn: {
    height: 60,
    width: 150,
  },
};

export default connect(stateToProps, actionsToProps)(Login);


