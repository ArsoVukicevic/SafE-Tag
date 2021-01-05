import React from 'react'

import {
  Redirect,
  Route
} from 'react-router-dom'

const AuthRoute = ({ component: Component, redirectPath = '/auth/login', isAuth, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        isAuth === true
          ? (<Component {...props} />)
          : (<Redirect
            to={{
              pathname: redirectPath,
              state: { from: props.location }
            }}
          />
          )
      }
    />
  )
}

export default AuthRoute
