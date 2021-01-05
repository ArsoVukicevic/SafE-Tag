import React, { Component } from 'react'
import Auth from '../Auth'
import { connect } from 'react-redux'

import {
  Switch,
  Redirect
} from 'react-router-dom'

import { isAuthAction } from '../Auth/reducer'
import { selectUser, selectLoading } from '../Auth/selectors'
import Admin from '../Admin'
import AuthRoute from './AuthRoute.js'

import '../../assets/vendor/nucleo/css/nucleo.css'
import '../../assets/vendor/@fortawesome/fontawesome-free/css/all.min.css'
import '../../assets/scss/argon-dashboard-react.scss'

const actionsToProps = dispatch => ({
  isAuthAction: (payload) => dispatch(isAuthAction(payload))
})

const stateToProps = state => ({
  selectUser: selectUser(state),
  selectLoading: selectLoading(state)
})

class App extends Component {
  componentDidMount() {
    this.props.isAuthAction()
  }

  render() {
    const isAuth = !!this.props.selectUser
    return (
      this.props.selectLoading === true
        ? <div className="loader"></div>
        : <Switch>
          <AuthRoute path='/admin' component={Admin} isAuth={isAuth}/>
          <AuthRoute path="/auth" component={Auth} redirectPath='/home' isAuth={!isAuth}/>

          <Redirect to='/admin' />
        </Switch>

    )
  }
}

export default connect(stateToProps, actionsToProps)(App)
