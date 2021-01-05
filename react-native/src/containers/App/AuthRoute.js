import React from 'react';

import { Route, Redirect } from 'react-router-native';

const AuthRoute = ({ component, redirectPath = '/login', isAuth, propsToComponent, ...rest }) => {
  let ComponentToRender = component;
  return (
    <Route
      {...rest}
      render={props =>
        isAuth === true
          ? (<ComponentToRender {...props} {...propsToComponent} />)
          : (<Redirect
            to={{
              pathname: redirectPath,
              state: { from: props.location },
            }}
          />
          )
      }
    />
  );
};

export default AuthRoute;
