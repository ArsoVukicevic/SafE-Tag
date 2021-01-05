import { fromJS } from 'immutable'
import { createAction } from 'redux-actions'

export const INSERT_USER = 'ADMIN@@INSERT_USER'
export const INSERT_USER_SUCCESS = 'ADMIN@@INSERT_USER_SUCCESS'
export const INSERT_USER_FAILED = 'ADMIN@@INSERT_USER_FAILED'

export const UPDATE_USER = 'ADMIN@@UPDATE_USER'
export const UPDATE_USER_SUCCESS = 'ADMIN@@UPDATE_USER_SUCCESS'
export const UPDATE_USER_FAILED = 'ADMIN@@UPDATE_USER_FAILED'

export const INSERT_USER_VIEW = 'ADMIN@@INSERT_USER_VIEW'
export const INSERT_USER_VIEW_SUCCESS = 'ADMIN@@INSERT_USER_VIEW_SUCCESS'

export const GET_USERS = 'ADMIN@@GET_USERS'
export const GET_USERS_SUCCESS = 'ADMIN@@GET_USERS_SUCCESS'

export const GET_FACTORIES = 'ADMIN@@GET_FACTORIES'
export const GET_FACTORIES_SUCCESS = 'ADMIN@@GET_FACTORIES_SUCCESS'

export const GET_FACTORY = 'ADMIN@@GET_FACTORY'
export const GET_FACTORY_SUCCESS = 'ADMIN@@GET_FACTORY_SUCCESS'

export const INSERT_FACTORY = 'ADMIN@@INSERT_FACTORY'
export const INSERT_FACTORY_SUCCESS = 'ADMIN@@INSERT_FACTORY_SUCCESS'
export const INSERT_FACTORY_FAILED = 'ADMIN@@INSERT_FACTORY_FAILED'

export const UPDATE_FACTORY = 'ADMIN@@UPDATE_FACTORY'
export const UPDATE_FACTORY_SUCCESS = 'ADMIN@@UPDATE_FACTORY_SUCCESS'
export const UPDATE_FACTORY_FAILED = 'ADMIN@@UPDATE_FACTORY_FAILED'

export const UPDATE_PROFILE_FACTORY = 'ADMIN@@UPDATE_PROFILE_FACTORY'
export const UPDATE_PROFILE_FACTORY_SUCCESS = 'ADMIN@@UPDATE_PROFILE_FACTORY_SUCCESS'
export const UPDATE_PROFILE_FACTORY_FAILED = 'ADMIN@@UPDATE_PROFILE_FACTORY_FAILED'

export const GET_CLASSIFICATION_AND_ITEM_TREE = 'ADMIN@@GET_CLASSIFICATION_AND_ITEM_TREE'
export const GET_CLASSIFICATION_AND_ITEM_TREE_SUCCESS = 'ADMIN@@GET_CLASSIFICATION_AND_ITEM_TREE_SUCCESS'

export const INSERT_ITEM = 'ADMIN@@INSERT_ITEM'
export const INSERT_ITEM_SUCCESS = 'ADMIN@@INSERT_ITEM_SUCCESS'
export const INSERT_ITEM_FAILED = 'ADMIN@@INSERT_ITEM_FAILED'

export const UPDATE_ITEM = 'ADMIN@@UPDATE_ITEM'
export const UPDATE_ITEM_SUCCESS = 'ADMIN@@UPDATE_ITEM_SUCCESS'
export const UPDATE_ITEM_FAILED = 'ADMIN@@UPDATE_ITEM_FAILED'

export const INSERT_CLASSIFICATION = 'ADMIN@@INSERT_CLASSIFICATION'
export const INSERT_CLASSIFICATION_SUCCESS = 'ADMIN@@INSERT_CLASSIFICATION_SUCCESS'
export const INSERT_CLASSIFICATION_FAILED = 'ADMIN@@INSERT_CLASSIFICATION_FAILED'

export const SET_SEARCH_VALUE = 'ADMIN@@SET_SEARCH_VALUE'

export const GET_AUDIT = 'ADMIN@@GET_AUDIT'
export const GET_AUDIT_SUCCESS = 'ADMIN@@GET_AUDIT_SUCCESS'

export const INSERT_AUDIT = 'ADMIN@@INSERT_AUDIT'
export const INSERT_AUDIT_SUCCESS = 'ADMIN@@INSERT_AUDIT_SUCCESS'
export const INSERT_AUDIT_FAILED = 'ADMIN@@INSERT_AUDIT_FAILED'

const createTable = (state, payload, value, insert) => {
  let table = state.get(value)
  if (!table) {
    if (insert) { return null }
    table = []
  }
  return Array.from(table).concat(payload)
}

const updateTableOfUsers = (state, payload) => {
  const tableOfUser = state.get('tableOfUsers')
  const newTableOfUser = tableOfUser.map(user => {
    if (user.id === payload.userId) {
      user.name = payload.name
      user.email = payload.email
      user.lastname = payload.lastname
      user.roleId = payload.roleId
      user.role = payload.roleName
      user.phone = payload.phone
      user.isActive = payload.isActive
      user.workingPlace = payload.workingPlace
      user.factory.id = payload.factoryId
      user.factory.name = payload.factoryName
    }
    return user
  })
  return newTableOfUser
}

const updateTableOfFactories = (state, payload) => {
  const tableOfFactories = state.get('tableOfFactories')
  const newTableOfFactories = tableOfFactories.map(f => {
    if (f.id === payload.id) {
      f.name = payload.name
      f.phone = payload.phone
      f.address = payload.address
      f.info = payload.info
      f.licencePaid = payload.licencePaid
    }
    return f
  })
  return newTableOfFactories
}

const itemsUpdate = (state, payload) => {
  const classificationAndItem = state.get('classificationAndItemTree')

  return {
    items: payload,
    classifications: classificationAndItem && classificationAndItem.classifications
  }
}

const initialState = fromJS({
  tableOfUsers: null,
  tableOfFactories: null,
  insertUserViewData: null,
  classificationAndItemTree: null,
  classificationAndItem: null,
  factoryInfo: null,

  errorMsg: null,
  requestSuccess: false,

  searchQuery: '',
  employeesForInsert: null,
  employeesForView: null,
  audit: null
})

function adminReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USERS_SUCCESS:
      return state.set('tableOfUsers', createTable(state, action.payload), 'tableOfUsers')
    case INSERT_USER_SUCCESS:
      return state
        .set('tableOfUsers', createTable(state, [action.payload], 'tableOfUsers', true))
        .set('requestSuccess', true)
        .set('errorMsg', null)
    case UPDATE_USER_SUCCESS:
      return state
        .set('tableOfUsers', updateTableOfUsers(state, action.payload))
        .set('requestSuccess', true)
        .set('errorMsg', null)
    case GET_FACTORIES_SUCCESS:
      return state.set('tableOfFactories', createTable(state, action.payload, 'tableOfFactories'))
    case INSERT_FACTORY_SUCCESS:
      return state
        .set('tableOfFactories', createTable(state, [action.payload], 'tableOfFactories', true))
        .set('requestSuccess', true)
        .set('errorMsg', null)
    case UPDATE_FACTORY_SUCCESS:
      return state
        .set('tableOfFactories', updateTableOfFactories(state, action.payload))
        .set('errorMsg', null)
        .set('requestSuccess', true)
    case INSERT_ITEM_FAILED:
    case INSERT_CLASSIFICATION_FAILED:
    case INSERT_USER_FAILED:
    case UPDATE_USER_FAILED:
    case UPDATE_ITEM_FAILED:
    case UPDATE_FACTORY_FAILED:
    case INSERT_FACTORY_FAILED:
    case UPDATE_PROFILE_FACTORY_FAILED:
      return state
        .set('errorMsg', action.payload)
        .set('requestSuccess', false)
    case INSERT_USER:
    case UPDATE_USER:
    case INSERT_FACTORY:
    case UPDATE_FACTORY:
    case INSERT_ITEM:
    case UPDATE_ITEM:
    case INSERT_CLASSIFICATION:
    case GET_FACTORY:
    case UPDATE_PROFILE_FACTORY:
      return state
        .set('errorMsg', null)
        .set('requestSuccess', false)
    case GET_CLASSIFICATION_AND_ITEM_TREE_SUCCESS:
      return state
        .set('classificationAndItemTree', action.payload.tree)
        .set('classificationAndItem', action.payload.array)
    case INSERT_ITEM_SUCCESS:
    case UPDATE_ITEM_SUCCESS:
    case INSERT_CLASSIFICATION_SUCCESS:
      return state
        .set('errorMsg', null)
        .set('requestSuccess', true)
    case GET_FACTORY_SUCCESS:
      return state.set('factoryInfo', action.payload)
    case UPDATE_PROFILE_FACTORY_SUCCESS:
      return state.set('factoryInfo', action.payload)
        .set('errorMsg', null)
        .set('requestSuccess', true)
    case SET_SEARCH_VALUE:
      return state.set('searchQuery', action.payload)
    case GET_AUDIT_SUCCESS:
      return state
        .set('classificationAndItemTree', itemsUpdate(state, action.payload.items))
        .set('employeesForInsert', action.payload.employeesForInsert)
        .set('employeesForView', action.payload.employeesForView)
        .set('audit', action.payload.audit)
    case INSERT_AUDIT:
      return state
        .set('errorMsg', null)
        .set('requestSuccess', false)
    case INSERT_AUDIT_SUCCESS:
      return state
        .set('employeesForInsert', action.payload.employeesForInsert)
        .set('employeesForView', action.payload.employeesForView)
        .set('audit', action.payload.audit)
        .set('errorMsg', null)
        .set('requestSuccess', true)
    case INSERT_AUDIT_FAILED:
      return state
        .set('errorMsg', action.payload)
    default:
      return state
  }
}

export default adminReducer

export const insertUserAction = createAction(INSERT_USER)
export const getUsersAction = createAction(GET_USERS)
export const updateUserAction = createAction(UPDATE_USER)
export const getFactoriesAction = createAction(GET_FACTORIES)
export const insertFactoryAction = createAction(INSERT_FACTORY)
export const updateFactoryAction = createAction(UPDATE_FACTORY)
export const getClassificationAndItemTreeAction = createAction(GET_CLASSIFICATION_AND_ITEM_TREE)
export const insertItemAction = createAction(INSERT_ITEM)
export const updateItemAction = createAction(UPDATE_ITEM)
export const insertClassificationAction = createAction(INSERT_CLASSIFICATION)
export const getFactoryAction = createAction(GET_FACTORY)
export const updateProfileFactoryAction = createAction(UPDATE_PROFILE_FACTORY)
export const search = createAction(SET_SEARCH_VALUE)
export const getAudit = createAction(GET_AUDIT)
export const insertAudit = createAction(INSERT_AUDIT)
