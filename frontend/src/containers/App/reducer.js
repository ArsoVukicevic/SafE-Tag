import { fromJS } from 'immutable'
import { createAction } from 'redux-actions'

export const INSERT_USER_VIEW = 'ADMIN@@INSERT_USER_VIEW'
export const INSERT_USER_VIEW_SUCCESS = 'ADMIN@@INSERT_USER_VIEW_SUCCESS'

const initialState = fromJS({
  insertUserViewData: null
})

function authReducer(state = initialState, action) {
  switch (action.type) {
    case INSERT_USER_VIEW_SUCCESS:
      return state.set('insertUserViewData', action.payload)
    default:
      return state
  }
}

export default authReducer

export const insertUserViewAction = createAction(INSERT_USER_VIEW)
