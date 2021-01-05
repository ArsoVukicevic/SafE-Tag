import { takeEvery, put, call } from 'redux-saga/effects'
import request from '../../utils/request'

import { LOGIN, LOGIN_SUCCESS, LOGIN_ERROR, IS_AUTH, IS_AUTH_SUCCESS, LOGOUT } from './reducer'

export default function * watcherAuthSaga() {
  yield takeEvery(LOGIN, workerLoginSaga)
  yield takeEvery(IS_AUTH, workerIsAuthSaga)
  yield takeEvery(LOGOUT, workerLogoutSaga)
}

function * workerLoginSaga(action) {
  try {
    const email = action.payload.email
    const pass = action.payload.pass

    const response = yield call(request, `/doLogin?email=${email}&pass=${pass}`, { method: 'GET', credentials: 'include' })

    if (response === undefined || response.status !== 1) {
      yield put({ type: LOGIN_ERROR, payload: response.error.message })
    } else {
      yield put({ type: LOGIN_SUCCESS, payload: response.data })
    }
  } catch (e) {
    yield put({ type: LOGIN_ERROR, payload: 'Generic Error! Please try again in few minutes' })
  }
}

function * workerIsAuthSaga() {
  try {
    const response = yield call(request, '/checkLogin', { method: 'GET', credentials: 'include' })

    if (response === undefined || response.status !== 1) {
      // @TODO ADD ERROR HANDLING
      yield put({ type: LOGIN_ERROR, payload: response.error.message })
    } else {
      yield put({ type: IS_AUTH_SUCCESS, payload: response.data })
    }
  } catch (e) {
    console.log(e)
  }
}

function * workerLogoutSaga(action) {
  try {
    const response = yield call(request, '/logout', { method: 'GET', credentials: 'include' })

    if (response === undefined || response.status !== 1) {
      // yield put({ type: LOGIN_ERROR, payload: response.error.message })
    } else {
      // yield put({ type: LOGIN_SUCCESS, payload: response.data })
      console.log(response.data)
    }
  } catch (e) {
    // yield put({ type: LOGIN_ERROR, payload: 'Generic Error! Please try again in few minutes' })
  }
}
