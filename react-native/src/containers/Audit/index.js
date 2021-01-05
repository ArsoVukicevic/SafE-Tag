/* eslint-disable radix */
/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View, StyleSheet } from 'react-native';
import { List, Card, Button, Searchbar, RadioButton, TouchableRipple, Snackbar } from 'react-native-paper';
import { ScrollView, SafeAreaView, Text } from 'react-native';
import Header from '../../components/Header';
import { getAudit, setAuditStatus } from './reducer';
import { STATUS_COLOR, ROUTES } from '../../constants/common';
import RenderHandler from '../../components/RenderHandler';

const actionsToProps = dispatch => ({
    getAudit: (payload) => dispatch(getAudit(payload)),
    setAuditStatus: (payload) => dispatch(setAuditStatus(payload)),
});

const stateToProps = state => ({
    audit: state.audit.get('audit'),
    auditId: state.audit.get('auditId'),
    auditCount: state.audit.get('auditCount'),
    auditSuccess: state.audit.get('auditSuccess'),
    auditError: state.audit.get('auditError'),
    serverError: state.audit.get('serverError'),
});
function MyRadioButton({ onPressAction, field, text, ...rest }) {
    return (
        <TouchableRipple onPress={() => onPressAction(rest.value)}>
            <View style={style.centerContainer}>
                <RadioButton {...rest} />
                <Text>{text}</Text>
            </View>
        </TouchableRipple>
    );
}
class Audit extends Component {
    constructor() {
        super();

        this.state = {
            selectedItem: null,
            query: '',
            filterRadioButton: '2',
            checkRadioButton: 'not-checked',
            showSubmit: false,
            checkedNum: 0,
            alert: {
                visible: false,
            },
        };

        this.search = query => {
            this.setState({ query: query });
        };
        this.changeStatusOnFolders = (list, status) => {
            list.forEach(node => {
                if (node.nodes.length > 0) {
                    node.status = '1';
                    node.status = this.changeStatusOnFolders(node.nodes, node.status);

                }
                if (status == '-1' || node.status == '-1') {
                    status = '-1';
                } else if (status == '0') {
                    status = '0';
                } else {
                    status = node.status;
                }
            });
            return status;
        };
        this.filterFolders = (list, value) => {
            if (list.nodes.length === 0) {
                return value || ((this.state.filterRadioButton == 2 || list.status == this.state.filterRadioButton)
                    && list.name.toLowerCase().includes(this.state.query.toLowerCase()));
            }
            list.nodes.forEach(node => {
                value = this.filterFolders(node, value);
            });
            return value || (this.state.query !== '' && list.name.toLowerCase().includes(this.state.query.toLowerCase()));
        };

        this.renderList = (list) => {
            if (!list.hasOwnProperty('expanded')) {
                list.expanded = false;
            }

            return (
                list.nodes.length > 0 ?
                    (this.filterFolders(list, false)) &&
                    <List.Accordion
                        key={list.key}
                        title={list.name}
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{ paddingLeft: list.level * 20, backgroundColor: this.state.selectedItem === list.key ? 'lightgray' : 'white' }}
                        expanded={list.expanded}
                        titleStyle={style.blackText}
                        onPress={this.handlePressFolder.bind(this, list)}

                        left={props =>
                            <List.Icon {...props}
                                color={STATUS_COLOR[list.status]}
                                icon={this.state.selectedItem === list.key ? 'checkbox-blank-circle' : 'checkbox-blank-circle-outline'}
                            />
                        }
                    >
                        {
                            list.nodes.map(node => (
                                this.renderList(node)
                            ))
                        }
                    </List.Accordion >
                    : ((this.state.filterRadioButton == 2 || list.status == this.state.filterRadioButton)
                        && list.name.toLowerCase().includes(this.state.query.toLowerCase())) &&
                    <List.Item
                        key={list.key}
                        title={list.name}
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{ paddingLeft: list.level * 20 + 10, backgroundColor: this.state.selectedItem === list.key ? 'lightgray' : 'white' }}
                        onPress={this.handlePress.bind(this, list)}
                        titleStyle={style.blackText}
                        left={props =>
                            <List.Icon {...props}
                                color={'black'}
                                icon={this.state.selectedItem === list.key ? 'checkbox-blank-circle' : 'checkbox-blank-circle-outline'}
                            />}
                        right={() =>
                            <View
                                // eslint-disable-next-line react-native/no-inline-styles
                                style={{
                                    alignSelf: 'center',
                                    display: 'flex',
                                    width: 45,
                                    height: 15,
                                    backgroundColor: STATUS_COLOR[list.status],
                                    right: 0,
                                }} />

                        }
                    />
            );
        };



        this.updateState = (value) => {
            let checkedNum = this.state.checkedNum;
            if (this.item.status == '0') {
                if (value != '0') {
                    checkedNum = parseInt(checkedNum) + 1;

                }
            } else {
                if (value == '0') {
                    checkedNum = parseInt(checkedNum) - 1;
                }
            }
            this.item.status = value;
            this.changeStatusOnFolders(this.props.audit, '1');
            this.setState({
                checkRadioButton: value,
                checkedNum,
            });
        };

        this.filterData = (value) => {
            this.setState({
                filterRadioButton: value,
            });
        };

        this.handlePressFolder = (list) => {
            list.expanded = !list.expanded;
            this.setState({
                selectedItem: list.key,
                showSubmit: false,
            });
        };
        this.handlePress = (item) => {
            this.item = item;
            this.setState({
                selectedItem: this.state.selectedItem === item.key ? null : item.key,
                showSubmit: true,
                checkRadioButton: item.status + '',
            });
        };
        this.submitChanges = () => {
            this.props.setAuditStatus({ audit: this.props.audit, auditId: this.props.auditId });
        };

        this.renderContent = () => {
            const list = this.props.audit;
            return (
                <Card style={style.flex}>
                    <SafeAreaView style={style.scrollContainer}>
                        <View style={style.header}>
                            <RadioButton.Group
                                onValueChange={v => this.filterData(v)}
                                value={this.state.filterRadioButton}
                            >
                                <View style={style.filterContainer}>
                                    <View style={style.filterHolder}>
                                        <MyRadioButton value="2" text="All" onPressAction={this.filterData} />
                                        <MyRadioButton value="0" text="Not Checked" onPressAction={this.filterData} />
                                        <MyRadioButton value="1" text="OK" onPressAction={this.filterData} />
                                        <MyRadioButton value="-1" text="Not OK" onPressAction={this.filterData} />
                                    </View>
                                </View>
                            </RadioButton.Group>
                            <View style={style.searchContainer}>
                                <Searchbar
                                    placeholder="Search by name"
                                    onChangeText={this.search}
                                    value={this.state.query}
                                    style={style.search}
                                />
                                <Text style={style.counterHolder}>
                                    {this.state.checkedNum}/{this.props.auditCount}
                                </Text>
                            </View>
                        </View>
                        <ScrollView >
                            <Card>
                                <List.Section >
                                    {list.length > 0 ?
                                        list.map(location => this.renderList(location))
                                        : <List.Item
                                            key={'no-items'}
                                            title={'There is no Audit assined on you'} />
                                    }
                                </List.Section>
                            </Card>
                        </ScrollView>
                    </SafeAreaView>

                    <Card.Actions style={[this.state.showSubmit ? style.flex : style.flex_0_5, style.actions]}>
                        {this.state.showSubmit &&
                            <View>
                                <RadioButton.Group
                                    onValueChange={v => this.updateState(v)}
                                    value={this.state.checkRadioButton}
                                >
                                    <MyRadioButton value="0" text="Not Checked" onPressAction={this.updateState} uncheckedColor="gold" color="gold" />
                                    <MyRadioButton value="1" text="OK" onPressAction={this.updateState} uncheckedColor="green" color="green" />
                                    <MyRadioButton value="-1" text="Not OK" onPressAction={this.updateState} uncheckedColor="red" color="red" />
                                </RadioButton.Group>
                            </View>
                        }
                        <Button
                            mode="contained"
                            style={style.submitButton}
                            disabled={(this.state.checkedNum != this.props.auditCount) || this.props.auditCount === 0}
                            onPress={this.submitChanges} >
                            Submit
                        </Button>
                    </Card.Actions>
                    <Snackbar
                        visible={this.state.alert.visible}
                        onDismiss={() => this.props.history.push(ROUTES.HOME.ROOT)}
                        duration={3000}
                        style={{
                            backgroundColor: this.state.alert.color,
                        }}
                    >
                        {this.state.alert.message}
                    </Snackbar>
                </Card >
            );
        };
    }

    componentDidMount() {
        this.props.getAudit();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.audit !== prevProps.audit) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                auditList: this.props.audit,
            });
        }

        if (this.props.auditError !== null && prevProps.auditError == null) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                alert: {
                    color: 'red',
                    visible: true,
                    message: this.props.auditError,
                },
            });
        }
        else if (this.props.auditSuccess && !prevProps.auditSuccess) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                alert: {
                    color: 'green',
                    visible: true,
                    message: 'Audit is successfuly submited',
                },
            });
        }
    }


    render() {
        return (
            <>
                <Header title={'Audit'} {...this.props} />
                <RenderHandler
                    value={this.props.audit}
                    error={this.props.serverError}
                    renderFunction={this.renderContent}
                />
            </>
        );
    }
}

const style = StyleSheet.create({
    scrollContainer: {
        flex: 5,
    },
    actions: {
        borderTopColor: 'black',
        borderWidth: 0.5,
        width: '100%',
        paddingLeft: 25,
    },
    flex: {
        flex: 1,
    },
    flex_0_5: {
        flex: 0.5,
    },
    centerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    submitButton: {
        position: 'absolute',
        bottom: 15,
        right: 15,
    },
    blackText: {
        color: 'black',
    },
    filterContainer: {
        alignSelf: 'center',
        marginTop: 10,
    },
    filterHolder: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
    },
    searchContainer: {
        flexDirection: 'row',
    },
    search: {
        width: '80%',
        marginLeft: 10,
    },
    counterHolder: {
        fontSize: 25,
        position: 'absolute',
        right: 10,
        alignSelf: 'center',
    },
});
export default connect(stateToProps, actionsToProps)(Audit);
