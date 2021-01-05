import { takeEvery, put, call, select } from 'redux-saga/effects'
import request from '../../utils/request'
import {
  INSERT_USER, INSERT_USER_SUCCESS, INSERT_USER_FAILED
  , GET_USERS, GET_USERS_SUCCESS
  , UPDATE_USER, UPDATE_USER_SUCCESS, UPDATE_USER_FAILED
  , GET_FACTORIES, GET_FACTORIES_SUCCESS
  , INSERT_FACTORY, INSERT_FACTORY_SUCCESS
  , UPDATE_FACTORY, UPDATE_FACTORY_SUCCESS, INSERT_FACTORY_FAILED, UPDATE_FACTORY_FAILED
  , GET_CLASSIFICATION_AND_ITEM_TREE, GET_CLASSIFICATION_AND_ITEM_TREE_SUCCESS
  , INSERT_ITEM, INSERT_ITEM_SUCCESS, INSERT_ITEM_FAILED
  , UPDATE_ITEM, UPDATE_ITEM_SUCCESS, UPDATE_ITEM_FAILED
  , GET_FACTORY, GET_FACTORY_SUCCESS
  , UPDATE_PROFILE_FACTORY, UPDATE_PROFILE_FACTORY_SUCCESS, UPDATE_PROFILE_FACTORY_FAILED
  , INSERT_CLASSIFICATION, INSERT_CLASSIFICATION_SUCCESS, INSERT_CLASSIFICATION_FAILED
  , GET_AUDIT, INSERT_AUDIT, GET_AUDIT_SUCCESS, INSERT_AUDIT_SUCCESS, INSERT_AUDIT_FAILED
} from './reducer'
import { selectAudit, selectEmployeesForView, selectEmployeesForInsert } from './selectors'

export default function * watcherAdminSaga() {
  yield takeEvery(INSERT_USER, workerInsertUserSaga)
  yield takeEvery(UPDATE_USER, workerUpdateUserSaga)
  yield takeEvery(GET_USERS, workerGetUsersSaga)
  yield takeEvery(GET_FACTORIES, workerGetFactoriesSaga)
  yield takeEvery(INSERT_FACTORY, workerInsertFactorySaga)
  yield takeEvery(UPDATE_FACTORY, workerUpdateFactorySaga)
  yield takeEvery(UPDATE_PROFILE_FACTORY, workerUpdateProfileFactorySaga)
  yield takeEvery(GET_CLASSIFICATION_AND_ITEM_TREE, workerGetClassificationAndItemTreeSaga)
  yield takeEvery(INSERT_ITEM, workerInsertItemSaga)
  yield takeEvery(UPDATE_ITEM, workerUpdateItemSaga)
  yield takeEvery(INSERT_CLASSIFICATION, workerInsertClassificationSaga)
  yield takeEvery(GET_FACTORY, workerGetFactorySaga)
  yield takeEvery(GET_AUDIT, workerGetAuditSaga)
  yield takeEvery(INSERT_AUDIT, workerInsertAuditSaga)
}

function * workerInsertUserSaga(action) {
  try {
    const response = yield call(request, '/insertUser', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.payload)
    })

    if (response === undefined || response.status !== 1) {
      yield put({ type: INSERT_USER_FAILED, payload: response.error.message })
    } else {
      yield put({ type: INSERT_USER_SUCCESS, payload: response.data })
    }
  } catch (e) {
    yield put({ type: INSERT_USER_FAILED, payload: 'Generic Error! Please try again in few minutes' })
  }
}

function * workerUpdateUserSaga(action) {
  try {
    const response = yield call(request, '/updateUser', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.payload)
    })

    if (response === undefined || response.status !== 1) {
      yield put({ type: UPDATE_USER_FAILED, payload: response.error.message })
    } else {
      yield put({ type: UPDATE_USER_SUCCESS, payload: action.payload })
    }
  } catch (e) {
    yield put({ type: UPDATE_USER_FAILED, payload: 'Generic Error! Please try again in few minutes' })
  }
}

function * workerGetUsersSaga(action) {
  try {
    const response = yield call(request, '/getUsers', { method: 'GET', credentials: 'include' })

    if (response === undefined || response.status !== 1) {
      // yield put({ type: INSERT_USER_FAILED, payload: response.error.message })
    } else {
      yield put({ type: GET_USERS_SUCCESS, payload: response.data })
    }
  } catch (e) {
    console.log(e)
    // yield put({ type: INSERT_USER_FAILED, payload: 'Generic Error! Please try again in few minutes' })
  }
}

function * workerGetFactoriesSaga(action) {
  try {
    const response = yield call(request, '/getFactories', { method: 'GET', credentials: 'include' })

    if (response === undefined || response.status !== 1) {
      // yield put({ type: INSERT_USER_FAILED, payload: response.error.message })
    } else {
      yield put({ type: GET_FACTORIES_SUCCESS, payload: response.data })
    }
  } catch (e) {
    console.log(e)
    // yield put({ type: INSERT_USER_FAILED, payload: 'Generic Error! Please try again in few minutes' })
  }
}

function * workerInsertFactorySaga(action) {
  try {
    const response = yield call(request, '/insertFactory', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.payload)
    })

    if (response === undefined || response.status !== 1) {
      yield put({ type: INSERT_FACTORY_FAILED, payload: response.error.message })
    } else {
      yield put({ type: INSERT_FACTORY_SUCCESS, payload: response.data })
    }
  } catch (e) {
    yield put({ type: INSERT_FACTORY_FAILED, payload: 'Generic Error! Please try again in few minutes' })
  }
}

function * workerUpdateFactorySaga(action) {
  try {
    const response = yield call(request, '/updateFactory', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.payload)
    })

    if (response === undefined || response.status !== 1) {
      yield put({ type: UPDATE_FACTORY_FAILED, payload: response.error.message })
    } else {
      yield put({ type: UPDATE_FACTORY_SUCCESS, payload: action.payload })
    }
  } catch (e) {
    yield put({ type: UPDATE_FACTORY_FAILED, payload: 'Generic Error! Please try again in few minutes' })
  }
}
function getArrayFromTree(tree, array) {
  tree.forEach(node => {
    let levelIndicator = ''
    let i = node.level
    while (i > 0) {
      levelIndicator += '.'
      i--
    }
    array.push({
      id: node.key,
      name: levelIndicator + node.name
    })
    getArrayFromTree(node.nodes, array)
  })
}
function * workerGetClassificationAndItemTreeSaga(action) {
  try {
    const response = yield call(request, '/getClassificationAndItemTree', { method: 'GET', credentials: 'include' })

    if (response === undefined || response.status !== 1) {
      // yield put({ type: UPDATE_FACTORY_FAILED, payload: response.error.message })
    } else {
      const items = []
      getArrayFromTree(response.data.items, items)
      const classifications = {}
      Object.keys(response.data.classifications).forEach(key => {
        classifications[key] = []
        getArrayFromTree(response.data.classifications[key], classifications[key])
      })

      yield put({
        type: GET_CLASSIFICATION_AND_ITEM_TREE_SUCCESS,
        payload: {
          tree: response.data,
          array: {
            items,
            classifications
          }
        }
      })
    }
  } catch (e) {
    console.log(e)
    // yield put({ type: UPDATE_FACTORY_FAILED, payload: 'Generic Error! Please try again in few minutes' })
  }
}

function * workerInsertClassificationSaga(action) {
  try {
    const response = yield call(request, '/insertClassification', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.payload)
    })

    if (response === undefined || response.status !== 1) {
      yield put({ type: INSERT_CLASSIFICATION_FAILED, payload: response.error.message })
    } else {
      response.data.typeId = action.payload.typeId
      yield put({ type: INSERT_CLASSIFICATION_SUCCESS })
      yield put({
        type: GET_CLASSIFICATION_AND_ITEM_TREE
      })
    }
  } catch (e) {
    yield put({ type: INSERT_CLASSIFICATION_FAILED, payload: 'Generic Error! Please try again in few minutes' })
  }
}

function * workerInsertItemSaga(action) {
  try {
    const response = yield call(request, '/insertItem', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.payload)
    })

    if (response === undefined || response.status !== 1) {
      yield put({ type: INSERT_ITEM_FAILED, payload: response.error.message })
    } else {
      yield put({ type: INSERT_ITEM_SUCCESS })
      yield put({
        type: GET_CLASSIFICATION_AND_ITEM_TREE
      })
    }
  } catch (e) {
    yield put({ type: INSERT_ITEM_FAILED, payload: 'Generic Error! Please try again in few minutes' })
  }
}

function * workerUpdateItemSaga(action) {
  try {
    const response = yield call(request, '/updateItem', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.payload)
    })

    if (response === undefined || response.status !== 1) {
      yield put({ type: UPDATE_ITEM_FAILED, payload: response.error.message })
    } else {
      yield put({ type: UPDATE_ITEM_SUCCESS })
      yield put({
        type: GET_CLASSIFICATION_AND_ITEM_TREE
      })
    }
  } catch (e) {
    yield put({ type: UPDATE_ITEM_FAILED, payload: 'Generic Error! Please try again in few minutes' })
  }
}

function * workerGetFactorySaga(action) {
  try {
    const response = yield call(request, '/getFactory', { method: 'GET', credentials: 'include' })

    if (response === undefined || response.status !== 1) {
      // yield put({ type: INSERT_ITEM_FAILED, payload: response.error.message })
    } else {
      yield put({ type: GET_FACTORY_SUCCESS, payload: response.data })
    }
  } catch (e) {
    // yield put({ type: INSERT_ITEM_FAILED, payload: 'Generic Error! Please try again in few minutes' })
  }
}

function * workerUpdateProfileFactorySaga(action) {
  try {
    const response = yield call(request, '/updateFactory', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.payload)
    })

    if (response === undefined || response.status !== 1) {
      yield put({ type: UPDATE_PROFILE_FACTORY_FAILED, payload: response.error.message })
    } else {
      yield put({ type: UPDATE_PROFILE_FACTORY_SUCCESS, payload: action.payload })
    }
  } catch (e) {
    yield put({ type: UPDATE_PROFILE_FACTORY_FAILED, payload: 'Generic Error! Please try again in few minutes' })
  }
}

function * workerGetAuditSaga(action) {
  try {
    const response = yield call(request, '/getAudit', { method: 'GET', credentials: 'include' })

    if (response === undefined || response.status !== 1) {
      // yield put({ type: INSERT_USER_FAILED, payload: response.error.message })
    } else {
      const employeesForView = response.data.employees.filter(e => e.id in response.data.audit)
      const employeesForInsert = response.data.employees

      yield put({
        type: GET_AUDIT_SUCCESS,
        payload: {
          audit: response.data.audit,
          items: response.data.items,
          employeesForView,
          employeesForInsert
        }
      })
    }
  } catch (e) {
    console.log(e)
    // yield put({ type: INSERT_USER_FAILED, payload: 'Generic Error! Please try again in few minutes' })
  }
}

function * workerInsertAuditSaga(action) {
  try {
    const response = yield call(request, '/insertAudit', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.payload)
    })

    if (response === undefined || response.status !== 1) {
      yield put({ type: INSERT_AUDIT_FAILED, payload: response.error.message })
    } else {
      let audit = yield select(selectAudit)
      const assignTo = action.payload.assignTo

      if (audit[assignTo]) {
        audit[assignTo] = { ...audit[assignTo], ...response.data[assignTo] }
      } else {
        audit = { ...audit, ...response.data }
      }

      const employeesForView = yield select(selectEmployeesForView)
      const employeesForInsert = yield select(selectEmployeesForInsert)
      const i = employeesForInsert.findIndex(e => e.id === action.payload.assignTo && !employeesForView.includes(e))
      i !== -1 && employeesForView.push(employeesForInsert[i])
      // employeesForInsert.splice(i, 1)
      yield put({
        type: INSERT_AUDIT_SUCCESS,
        payload: {
          audit,
          employeesForView,
          employeesForInsert
        }
      })
    }
  } catch (e) {
    yield put({ type: INSERT_AUDIT_FAILED, payload: 'Generic Error! Please try again in few minutes' })
  }
}
