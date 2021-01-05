
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
// reactstrap components
import { Container } from 'reactstrap'
// core components
import AdminNavbar from '../../components/Navbars/AdminNavbar.jsx'
import AdminFooter from '../../components//Footers/AdminFooter.jsx'
import Sidebar from '../../components/Sidebar/Sidebar.jsx'
import FactoryTable from '../Factory/FactoryTable.js'
import InsertFactory from '../Factory/InsertFactory.js'
import EditFactory from '../Factory/EditFactory.js'
import Profile from '../Profile/Profile.js'
import ROLES from '../../types/Roles.js'

import {
  updateFactoryAction, getFactoryAction, updateProfileFactoryAction, search
} from './reducer'
import {
  selectErrorMsg, selectRequestSuccess, selectFactoryInfo, selectSearchQuery
} from './selectors'
import { selectUser } from '../Auth/selectors'
import UsersTable from '../User/UsersTable.jsx'
import InsertUser from '../User/InsertUser.jsx'
import EditUser from '../User/EditUser.jsx'
import NuNpNm from '../Tree/NuNpNm.js'
import Audit from '../Tree/Audit.js'
import { logoutAction } from '../Auth/reducer.js'

const actionsToProps = dispatch => ({
  updateFactoryAction: (payload) => dispatch(updateFactoryAction(payload)),
  getFactoryAction: (payload) => dispatch(getFactoryAction(payload)),
  updateProfileFactoryAction: (payload) => dispatch(updateProfileFactoryAction(payload)),
  search: (payload) => dispatch(search(payload)),
  logout: (payload) => dispatch(logoutAction(payload))

})

const stateToProps = state => ({
  selectUser: selectUser(state),
  selectFactoryInfo: selectFactoryInfo(state),
  // Error handling
  selectErrorMsg: selectErrorMsg(state),
  selectRequestSuccess: selectRequestSuccess(state),
  searchQuery: selectSearchQuery(state)
})

class Admin extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.renderOwnerRoutes = this.renderOwnerRoutes.bind(this)
    this.renderAdminRoutes = this.renderAdminRoutes.bind(this)
  }

  handleChange(event) {
    this.props.search(event.target.value)
    // set search
  }

  renderOwnerRoutes() {
    const routes = []
    routes.push(
      <Route
        key='FactoryTable'
        path='/admin/factory-table'
        render={() => <FactoryTable />}
      />
    )
    routes.push(
      <Route
        key='InsertFactory'
        path='/admin/insert-factory'
        render={(props) => <InsertFactory {...props} />}
      />
    )

    routes.push(
      <Route
        key='EditFactory'
        path='/admin/edit-factory'
        render={(props) => <EditFactory {...props} />}
      />

    )
    return routes
  }

  renderAdminRoutes() {
    const routes = []
    routes.push(
      <Route
        key='tree'
        path='/admin/tree'
        render={(props) => <NuNpNm {...props}/> }
      />
    )

    routes.push(
      <Route
        key='profile'
        path='/admin/user-profile'
        render={() =>
          <Profile
            errMsg = {this.props.selectErrorMsg}
            updateSuccess= {this.props.selectRequestSuccess}
            user={this.props.selectUser}
            factoryInfo= {this.props.selectFactoryInfo}
            getFactoryAction={this.props.getFactoryAction}
            updateFactoryAction={this.props.updateProfileFactoryAction}
          />}
      />
    )
    routes.push(
      <Route
        key='AuditTable'
        path='/admin/audit'
        render={(props) =>
          <Audit {...props}/>}
      />
    )
    return routes
  }

  render () {
    return (
      <>
        <Sidebar
          user={this.props.selectUser}
        />
        <div className="main-content">
          <AdminNavbar
            logout={this.props.logout}
            location={this.props.location}
            user={this.props.selectUser}
            handleChange={this.handleChange}
            searchQuery={this.props.searchQuery}
          />
          <Switch>

            <Route
              path='/admin/user-table'
              render={(props) => <UsersTable {...props} />}
            />

            <Route
              path='/admin/insert-user'
              render={(props) => <InsertUser {...props} /> }
            />

            <Route
              path='/admin/edit-user'
              render={(props) => <EditUser {...props} />}
            />

            {this.props.selectUser.role === ROLES.ADMIN ? this.renderAdminRoutes() : null}
            {this.props.selectUser.role === ROLES.OWNER ? this.renderOwnerRoutes() : null}
            <Redirect from='/admin' to='/admin/user-table' />
          </Switch>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </>
    )
  }
}

export default connect(stateToProps, actionsToProps)(Admin)
