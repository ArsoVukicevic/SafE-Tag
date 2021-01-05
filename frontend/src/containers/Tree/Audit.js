
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import { selectClassificationAndItemTree, selectEmployeesForInsert, selectEmployeesForView, selectAudit, selectErrorMsg, selectRequestSuccess } from '../Admin/selectors'
import { getAudit, insertAudit } from '../Admin/reducer'
import InsertAudit from './InsertAudit'
import TableAudit from './TableAudit'
const actionsToProps = dispatch => ({
  getAudit: (payload) => dispatch(getAudit(payload)),
  insertAudit: (payload) => dispatch(insertAudit(payload))
})

const stateToProps = state => ({
  classificationAndItemTree: selectClassificationAndItemTree(state),
  employeesForInsert: selectEmployeesForInsert(state),
  employeesForView: selectEmployeesForView(state),
  audit: selectAudit(state),
  errMsg: selectErrorMsg(state),
  insertSuccess: selectRequestSuccess(state)
})

class Audit extends React.Component {
  componentDidMount() {
    this.props.getAudit()
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Audit componentDidUpdate')
  }

  render () {
    return (
      <React.Fragment>

        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8" />
        <Switch>
          <Route
            key='insert-audit'
            path='/admin/audit/insert-audit'
            render={() =>
              this.props.classificationAndItemTree !== null
                ? <InsertAudit
                  errMsg={this.props.errMsg}
                  insertSuccess={this.props.insertSuccess}
                  items={this.props.classificationAndItemTree.items}
                  allEmployees={this.props.employeesForInsert}
                  insertAudit={this.props.insertAudit}
                />
                : <div className="loader"></div>

            }
          />
          <Route
            key='table-audit'
            path='/admin/audit/table-audit'
            render={() =>
              this.props.classificationAndItemTree !== null && this.props.employeesForView !== null
                ? <TableAudit
                  audit={this.props.audit}
                  items={this.props.classificationAndItemTree.items}
                  allEmployees={this.props.employeesForView}
                />
                : <div className="loader"></div>
            }
          />
          <Redirect from='/admin/audit' to='/admin/audit/table-audit' />
        </Switch>
      </React.Fragment>

    )
  }
}

export default connect(stateToProps, actionsToProps)(Audit)
