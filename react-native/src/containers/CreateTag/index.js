import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-native';
import { RadioButton, Button, Snackbar, TouchableRipple } from 'react-native-paper';

import CustomButton from '../../components/CustomButton.js';
import centarConStyles from '../../assets/styles/CentarContainer';
import { getItemTreeAction, getClassificationTreeAction, openTagAction } from './reducer';
import { uploadImgAction } from '../App/reducer';
import Location from '../../components/CreateTag/Location.js';
import Classification from '../../components/CreateTag/Classification.js';
import RiskAssessment from '../../components/CreateTag/RiskAssessment.js';
import Description from '../../components/CreateTag/Description.js';
import ImgUpload from '../../utils/ImgUpload.js';
import { MSG_TYPE, COLORS, ROUTES } from '../../constants/common';
import Header from '../../components/Header.js';
import ROLES from '../../types/Roles.js';
import Trans from '../../translation/Trans.js';


const actionsToProps = dispatch => ({
  getItemTreeAction: (payload) => dispatch(getItemTreeAction(payload)),
  getClassificationTreeAction: (payload) => dispatch(getClassificationTreeAction(payload)),
  openTagAction: (payload) => dispatch(openTagAction(payload)),
  uploadImgAction: (payload) => dispatch(uploadImgAction(payload)),
});

const stateToProps = state => ({
  serverError: state.createTag.get('serverError'),
  locations: state.createTag.get('locations'),
  classifications: state.createTag.get('classifications'),
  user: state.app.get('user'),
  openTagError: state.createTag.get('openTagError'),
  openTagSuccess: state.createTag.get('openTagSuccess'),
});

function MyRadioButton({ onPressAction, field, text, ...rest }) {
  return (
    <TouchableRipple onPress={() => onPressAction(rest.value)}>
      <View style={styles.centerContainer}>
        <RadioButton {...rest} />
        <Text>{text}</Text>
      </View>
    </TouchableRipple>
  );
}
class CreateTag extends Component {

  constructor(props) {
    super(props);

    this.state = {
      radioButtonValue: 'first',
      preserveRiskValue: 0,
      preserveLocation: {
        list: null,
        selectedItem: null,
        selectedImage: null,
      },
      preserveClassification: {
        list: null,
        selectedItem: null,
        classificationId: 1,
      },
      alert: {
        visible: false,
      },
      render: false,
    };

    this.preserveDescription = [];

    this.updateState = this.updateState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createTagBody = this.createTagBody.bind(this);
    this.onMassagesChange = this.onMassagesChange.bind(this);
  }

  onMassagesChange(message) {
    if (message.message.trim().length > 0) {
      this.preserveDescription.push(message);
    }
  }

  createTagBody() {
    let isButtonDisabled = this.state.preserveLocation.selectedItem === null
      || this.state.preserveClassification.selectedItem === null
      || this.state.preserveRiskValue === 0
      || this.preserveDescription.length === 0
      || this.alreadyPressed;

    return (
      <>
        <Header title={Trans.CREATE_TAG_TITLE} history={this.props.history} />
        <View style={centarConStyles.container}>
          <CustomButton imgName="location" label={Trans.CREATE_TAG_LOCATION} path="/home/create-tag/location"
            labelColor={COLORS.CREATE_TAG_LABEL}
            bgColor={this.state.preserveLocation.selectedItem === null ? COLORS.CREATE_TAG_BTN : COLORS.selectedGreen}
          />
          <CustomButton imgName="classification" label={Trans.CREATE_TAG_CLASSIFICATION} path="/home/create-tag/classification"
            labelColor={COLORS.CREATE_TAG_LABEL}
            bgColor={this.state.preserveClassification.selectedItem === null ? COLORS.CREATE_TAG_BTN : COLORS.selectedGreen}
          />
          <CustomButton imgName="riskLevel" label={Trans.CREATE_TAG_RISK} path="/home/create-tag/risk-assessment"
            labelColor={COLORS.CREATE_TAG_LABEL}
            bgColor={this.state.preserveRiskValue === 0 ? COLORS.CREATE_TAG_BTN : COLORS.selectedGreen}
          />
          <CustomButton imgName="descriptionPhoto" label={Trans.CREATE_TAG_DESC_PHOTO} path="/home/create-tag/description"
            labelColor={COLORS.CREATE_TAG_LABEL}
            bgColor={this.preserveDescription.length === 0 ? COLORS.CREATE_TAG_BTN : COLORS.selectedGreen}
          />

          <View style={styles.RightContainer} >
            <View style={styles.TextStyleLeft}>
              <RadioButton.Group
                onValueChange={v => this.updateState({ radioButtonValue: v })}
                value={this.state.radioButtonValue}
              >
                {this.props.user.role === ROLES.MANAGER &&
                  <MyRadioButton
                    onPressAction={v => this.updateState({ radioButtonValue: v })}
                    value="first"
                    text={Trans.CREATE_TAG_ASSIGN_TO_ME} />
                }
                <MyRadioButton
                  onPressAction={v => this.updateState({ radioButtonValue: v })}
                  value="second"
                  text={Trans.CREATE_TAG_FORWARD_IT} />
              </RadioButton.Group>
            </View>
            <View style={styles.TextStyle}>
              <Button disabled={isButtonDisabled} loading={false} mode="contained" onPress={this.handleSubmit}>
                {Trans.CREATE_TAG_SUBMIT}
              </Button>
            </View>

          </View>
          <Snackbar
            visible={this.state.alert.visible}
            onDismiss={() => this.setState({ alert: { visible: false } })}
            duration={3000}
            style={{
              backgroundColor: this.state.alert.color,
            }}
          >
            {this.state.alert.message}
          </Snackbar>
        </View>
      </>
    );
  }

  updateState(value) {
    this.setState(value);
  }

  handleSubmit(event) {
    this.alreadyPressed = true;
    const requestModel = {};
    requestModel.riskLevel = this.state.preserveRiskValue;
    requestModel.classificationId = this.state.preserveClassification.selectedItem;
    requestModel.itemId = this.state.preserveLocation.selectedItem;
    requestModel.msgs = this.preserveDescription;
    requestModel.mode = this.state.radioButtonValue;

    const imgUpload = new ImgUpload();
    imgUpload.uploadImage(
      this.preserveDescription.filter(msg => msg.type === MSG_TYPE.IMAGE),
      this.props.uploadImgAction
    );

    this.props.openTagAction(requestModel);

    this.setState({
      render: !this.state.render,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.openTagError !== null && prevProps.openTagError == null) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        alert: {
          color: 'red',
          visible: true,
          message: this.props.openTagError,
        },
      });
    }
    else if (this.props.openTagSuccess && !prevProps.openTagSuccess) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        alert: {
          color: 'green',
          visible: true,
          message: 'Tag is successfuly opened',
        },
        radioButtonValue: 'first',
        preserveRiskValue: 0,
        preserveLocation: {
          list: null,
          selectedItem: null,
          selectedImage: null,
        },
        preserveClassification: {
          list: null,
          selectedItem: null,
          classificationId: 1,
        },
      });


      this.preserveDescription = [];
    }
  }

  render() {
    return (
      <Switch>

        <Route path={ROUTES.HOME.CREATE_TAG.LOCATION}
          render={(props) =>
            <Location
              serverError={this.props.serverError}
              getItemTreeAction={this.props.getItemTreeAction}
              list={this.state.preserveLocation.list != null ? this.state.preserveLocation.list : this.props.locations}
              selectedItem={this.state.preserveLocation.selectedItem}
              selectedImage={this.state.preserveLocation.selectedImage}
              callbackFunc={this.updateState}
              history={props.history}
            />
          } />

        <Route path={ROUTES.HOME.CREATE_TAG.CLASSIFICATION}
          render={(props) =>
            <Classification
              serverError={this.props.serverError}
              getClassificationTreeAction={this.props.getClassificationTreeAction}
              list={this.state.preserveClassification.list != null ? this.state.preserveClassification.list : this.props.classifications}
              selectedItem={this.state.preserveClassification.selectedItem}
              classificationId={this.state.preserveClassification.classificationId}
              callbackFunc={this.updateState}
              history={props.history}
            />
          } />

        <Route path={ROUTES.HOME.CREATE_TAG.RISK_ASSESSMENT}
          render={(props) =>
            <RiskAssessment
              riskValue={this.state.preserveRiskValue}
              callbackFunc={this.updateState}
              history={props.history}
            />
          } />

        <Route path={ROUTES.HOME.CREATE_TAG.DESCRIPTION}
          render={(props) =>
            <Description
              preserveDescription={this.preserveDescription}
              onMassagesChange={this.onMassagesChange}
              userId={this.props.user.id}
              history={props.history}
            />
          } />

        <Route path={ROUTES.HOME.CREATE_TAG.ROOT} render={(props) => this.createTagBody()} />
      </Switch>
    );
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    flexDirection: 'row',
    height: 70,
    width: '90%',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  RightContainer: {
    width: '90%',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  TextStyleLeft: {
    width: '45%',
    height: 70,
    flex: 1,
    color: '#fff',
    fontSize: 22,
  },
  TextStyle: {
    width: '45%',
    height: 70,
    flex: 1,
    color: '#fff',
    fontSize: 22,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  ImgStyle: {
    flexDirection: 'row',
    height: 50,
    width: 50,
    resizeMode: 'stretch',
    justifyContent: 'flex-end',
    marginEnd: 10,
  },
  bgOrange: {
    backgroundColor: 'orange',
  },
  bgBlue: {
    backgroundColor: '#0C8EA1',
  },
  bgPurple: {
    backgroundColor: '#86249A',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default connect(stateToProps, actionsToProps)(CreateTag);


