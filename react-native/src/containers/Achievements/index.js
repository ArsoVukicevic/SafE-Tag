import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Header from '../../components/Header.js';
import { getAchievementsAction } from './reducer.js';
import { DataTable, Card, Text } from 'react-native-paper';
import Confetti from 'react-native-confetti';
import LinearGradient from 'react-native-linear-gradient';
import RenderHandler from '../../components/RenderHandler.js';
import Trans from '../../translation/Trans.js';


const actionsToProps = dispatch => ({
  getAchievements: (payload) => dispatch(getAchievementsAction(payload)),
});

const stateToProps = state => ({
  achievements: state.achievements.get('achievements'),
  serverError: state.achievements.get('serverError'),
});

class Achievements extends Component {

  renderContent = () => {
    return (
      <LinearGradient
        colors={['#020024', '#7a1b6c', '#0c798f']}
        // colors={['#000000', '#eef22b', '#f4ff29']}
        style={styles.MainContainer}
      >
        <Confetti timeout={15} startOnLoad={true} />

        <Card style={styles.CardContainer}>
          <Text style={styles.Title}>{Trans.ACHIEVEMENTS_ACCOMPLISHMENT}</Text>
          <Card.Content>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>{Trans.ACHIEVEMENTS_CATEGORY}</DataTable.Title>
                <DataTable.Title numeric>{Trans.ACHIEVEMENTS_SCORE}</DataTable.Title>
                <DataTable.Title numeric>{Trans.ACHIEVEMENTS_RANK}</DataTable.Title>
              </DataTable.Header>

              <DataTable.Row>
                <DataTable.Cell >{Trans.ACHIEVEMENTS_TASK_DONE}</DataTable.Cell>
                <DataTable.Cell numeric>{this.props.achievements.tasksDone}</DataTable.Cell>
                <DataTable.Cell numeric>{this.props.achievements.tasksRank}</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>{Trans.ACHIEVEMENTS_TASK_REPORTED}</DataTable.Cell>
                <DataTable.Cell numeric>{this.props.achievements.tagsReported}</DataTable.Cell>
                <DataTable.Cell numeric>{this.props.achievements.tagsRank}</DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </Card.Content>
        </Card>
      </LinearGradient>
    );
  }

  componentDidMount() {
    this.props.getAchievements();
  }

  render() {
    return (
      <>
        <Header title={Trans.ACHIEVEMENTS_TITLE} {...this.props} />
        <RenderHandler
          value={this.props.achievements}
          error={this.props.serverError}
          renderFunction={this.renderContent}
        />
      </>
    );
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  CardContainer: {
    flexDirection: 'row',
    padding: 5,
    margin: 15,
  },
  Title: {
    fontSize: 20,
    textAlign: 'center',
    padding: 5,
    color: 'red',
  },
});
export default connect(stateToProps, actionsToProps)(Achievements);


