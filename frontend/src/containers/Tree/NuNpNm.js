
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import TestTree from '../../components/TestTree'
import { dropDownState } from '../../types/Classification'
import { selectClassificationAndItemTree, selectClassificationAndItem, selectRequestSuccess, selectErrorMsg } from '../Admin/selectors'
import { getClassificationAndItemTreeAction, insertClassificationAction, insertItemAction, updateItemAction } from '../Admin/reducer'
import InsertItemsClassification from './InsertItemsClassification'
import {
  Container
} from 'reactstrap'
import EditItems from './EditItems'

const actionsToProps = dispatch => ({
  getClassificationAndItemTree: (payload) => dispatch(getClassificationAndItemTreeAction(payload)),
  insertClassificationAction: (payload) => dispatch(insertClassificationAction(payload)),
  insertItemAction: (payload) => dispatch(insertItemAction(payload)),
  updateItemAction: (payload) => dispatch(updateItemAction(payload))
})

const stateToProps = state => ({
  classificationAndItemTree: selectClassificationAndItemTree(state),
  classificationAndItem: selectClassificationAndItem(state),
  selectRequestSuccess: selectRequestSuccess(state),
  selectErrorMsg: selectErrorMsg(state)
})

class NuNpNm extends React.Component {
  componentDidMount() {
    // if (!this.props.classificationAndItemTree) {
    this.props.getClassificationAndItemTree()
    // }
  }

  render () {
    return (
      <React.Fragment>

        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8" />
        <Switch>
          <Route
            key='classification'
            path='/admin/tree/classification'
            render={() =>
              <Container className="mt--7" fluid>
                {this.props.classificationAndItemTree && this.props.classificationAndItemTree.classifications
                  ? <TestTree
                    name="Classification"
                    dropDown={dropDownState}
                    items={this.props.classificationAndItemTree.classifications}
                  />
                  : <div className="loader"></div>
                }
              </Container>}
          />

          <Route
            key='items'
            path='/admin/tree/items'
            render={() =>
              <Container className="mt--7" fluid>

                {this.props.classificationAndItemTree && this.props.classificationAndItemTree.items
                  ? <TestTree
                    name="Location"
                    items={this.props.classificationAndItemTree.items }
                  />
                  : <div className="loader"></div>
                }
              </Container>
            }
          />

          <Route
            key='items'
            path='/admin/tree/insert-classification'
            render={() =>
              this.props.classificationAndItem
                ? <InsertItemsClassification
                  errMsg = {this.props.selectErrorMsg}
                  insertSuccess= {this.props.selectRequestSuccess}
                  classificationAndItems={this.props.classificationAndItem}
                  insertItem={this.props.insertItemAction}
                  insertClassification={this.props.insertClassificationAction}
                />
                : <div className="loader"></div>
            }
          />

          <Route
            key='edit-items'
            path='/admin/tree/edit-items'
            render={(props) =>
              <EditItems
                {...props}
                updateItemAction={this.props.updateItemAction}
                errMsg = {this.props.selectErrorMsg}
                updateSuccess= {this.props.selectRequestSuccess}
              />
            }
          />

          <Redirect from='/admin/tree' to='/admin/tree/classification' />
        </Switch>
      </React.Fragment>

    )
  }
}

export default connect(stateToProps, actionsToProps)(NuNpNm)
