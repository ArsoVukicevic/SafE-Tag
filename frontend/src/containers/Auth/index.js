import React, { Component } from 'react'

import { connect } from 'react-redux'

import { loginAction } from './reducer'
import { selectloginErrorMsg } from './selectors'

import { Route, Switch, Redirect } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'

import Login from '../../components/Login.jsx'
import Register from '../../components/Register.jsx'

const actionsToProps = dispatch => ({
  loginAction: (payload) => dispatch(loginAction(payload))
})

const stateToProps = state => ({
  selectloginErrorMsg: selectloginErrorMsg(state)
})

class Auth extends Component {
  componentDidMount() {
    console.log('Auth componenet componentDidMount')
    document.body.classList.add('bg-default')
  }

  componentWillUnmount() {
    console.log('Auth componenet componentWillUnmount')
    document.body.classList.remove('bg-default')
  }

  render() {
    return (
      <>
        <div className="main-content">
          {/* <AuthNavbar /> */}
          <div className="header bg-gradient-info py-7 py-lg-8">
            <Container>
              <div className="header-body text-center mb-7">
                <Row className="justify-content-center">
                  <Col lg="5" md="6">
                    <h1 className="text-white">Welcome!</h1>
                    <p className="text-lead text-light">
                      Use these forms to login or create new account
                    </p>
                  </Col>
                </Row>
              </div>
            </Container>
            <div className="separator separator-bottom separator-skew zindex-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-default"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </div>
          {/* Page content */}
          <Container className="mt--8 pb-5">
            <Row className="justify-content-center">
              <Switch>
                <Route path='/auth/login' render={(props) => <Login {...props} containerProps={this.props} />} />
                <Route path='/auth/login' component={Register} />

                <Redirect to='/auth/login' />
              </Switch>
            </Row>
          </Container>
        </div>
      </>
    )
  }
}

export default connect(stateToProps, actionsToProps)(Auth)
