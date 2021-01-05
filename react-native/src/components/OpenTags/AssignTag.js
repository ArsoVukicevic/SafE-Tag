
import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { Button, Searchbar, RadioButton } from 'react-native-paper';
import Chat from '../CreateTag/Chat';
import TagDetails from './TagDetails';
import RenderHandler from '../RenderHandler';
import Trans from '../../translation/Trans';

const labels = [
    Trans.ASSIGN_TAG_LBL_INFO,
    Trans.ASSIGN_TAG_LBL_ASSIGN,
    Trans.ASSIGN_TAG_LBL_INSTRUCTIONS
];
const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#fe7013',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#fe7013',
};

export default class AssignTag extends Component {

    constructor() {
        super();

        this.state = {
            currentPosition: 0,
            query: '',
            selectedEmployee: null,
            render: false,
        };
        this.stepCount = 3;
        this.searchedEmployees = null;
        this.preserveInstruction = [];

        this.goNext = () => {
            this.setState({ currentPosition: this.state.currentPosition + 1 });
        };
        this.goBack = () => {
            this.setState({ currentPosition: this.state.currentPosition - 1 });
        };
        this.search = query => {
            this.searchedEmployees = this.props.employees.filter(e =>
                e.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            );
            this.setState({ query: query });
        };
        this.selectEmployee = (id) => {
            this.setState({ selectedEmployee: id });
        };

        this.commit = () => {
            this.alreadyCommited = true;
            this.props.assignTag({
                msgs: this.preserveInstruction,
                employeeId: this.state.selectedEmployee,
            });
            this.setState({
                render: !this.state.render,
            });
        };

        this.onMassagesChange = (message) => {
            if (message.message.trim().length > 0) {
                this.preserveInstruction.push(message);
                this.setState({
                    render: !this.state.render,
                });
            }
        };

        this.renderFirstStep = () => (
            <View style={style.container}>
                <Searchbar
                    placeholder={Trans.ASSIGN_TAG_SEARCH_LABEL}
                    onChangeText={this.search}
                    value={this.state.query}
                />
                <SafeAreaView style={style.scrollContainer}>
                    <ScrollView >
                        {this.searchedEmployees.map(employee => (
                            employee.id !== this.props.user.id &&
                            <View key={employee.id} style={style.row}>
                                <RadioButton
                                    value={employee.id}
                                    status={this.state.selectedEmployee === employee.id ? 'checked' : 'unchecked'}
                                    onPress={this.selectEmployee.bind(this, employee.id)}
                                />
                                <Text style={style.employee}
                                    onPress={this.selectEmployee.bind(this, employee.id)}>{employee.name} {employee.lastName} - {employee.workingPlace}</Text>
                            </View>
                        ))
                        }
                    </ScrollView>
                </SafeAreaView>

            </View>
        );

        this.renderContent = () => {
            return (
                <View style={style.container}>
                    <StepIndicator
                        customStyles={customStyles}
                        stepCount={this.stepCount}
                        currentPosition={this.state.currentPosition}
                        labels={labels}
                    />
                    {this.state.currentPosition === 0
                        ? <TagDetails
                            match={this.props.match}
                            serverError={this.props.serverError}
                            resolvedButton={false}
                            tag={this.props.tag}
                            getOpenTagsDetailsAction={this.props.getOpenTagsDetailsAction}
                        />
                        : this.state.currentPosition === 1
                            ? this.renderFirstStep()
                            : <View style={style.scrollContainer}>
                                <Chat
                                    onMassagesChange={this.onMassagesChange}
                                    messagess={this.preserveInstruction}
                                    userId={this.props.user.id}
                                />
                            </View>
                    }
                    {
                        this.state.currentPosition > 0 &&
                        <Button mode="contained" onPress={this.goBack} style={style.backButton}> {Trans.ASSIGN_TAG_BTN_BACK} </Button>
                    }
                    {
                        this.state.currentPosition + 1 < this.stepCount &&
                        <Button mode="contained" onPress={this.goNext} style={style.nextButton}> {Trans.ASSIGN_TAG_BTN_NEXT} </Button>
                    }
                    {
                        this.state.currentPosition + 1 === this.stepCount &&
                        <Button mode="contained" onPress={this.commit} style={style.nextButton}
                            disabled={this.preserveInstruction.length === 0 || this.state.selectedEmployee === null || this.alreadyCommited}
                        > {Trans.ASSIGN_TAG_BTN_SUBMIT} </Button>
                    }
                </View >
            );
        };
    }

    componentDidMount() {
        this.props.getEmployees();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.employees !== this.props.employees) {
            this.searchedEmployees = this.props.employees;
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ render: !this.state.render });
        }
    }

    render() {
        return (
            <RenderHandler
                value={this.searchedEmployees}
                error={this.props.serverError}
                renderFunction={this.renderContent}
            />
        );
    }

}
const style = StyleSheet.create({
    nextButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },

    backButton: {
        position: 'absolute',
        bottom: 10,
        left: 10,
    },
    container: {
        flex: 1,
        padding: 5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    employee: {
        fontSize: 20,
    },
    scrollContainer: {
        flex: 1,
        marginBottom: 50,
    },
});
