import { fromJS } from 'immutable'
import { createAction } from 'redux-actions'

export const IS_AUTH = 'APP@@IS_AUTH'
export const IS_AUTH_SUCCESS = 'APP@@IS_AUTH_SUCCESS'

export const LOGIN = 'AUTH@@LOGIN'
export const LOGIN_SUCCESS = 'AUTH@@LOGIN_SUCCESS'
export const LOGIN_ERROR = 'AUTH@@LOGIN_ERROR'

export const LOGOUT = 'AUTH@@LOGOUT'

const initialState = fromJS({
  user: null,
  loading: true,
  loginErrorMsg: null
})

function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case IS_AUTH_SUCCESS:
      return state
        .set('user', action.payload)
        .set('loading', false)
    case LOGIN_ERROR:
      return state
        .set('loginErrorMsg', action.payload)
    default:
      return state
  }
}

export default authReducer

export const loginAction = createAction(LOGIN)
export const isAuthAction = createAction(IS_AUTH)

export const logoutAction = createAction(LOGOUT)
