import { takeEvery, put, call } from 'redux-saga/effects'
import request from '../../utils/request'

import { INSERT_USER_VIEW, INSERT_USER_VIEW_SUCCESS } from './reducer'

export default function * watcherAppSaga() {
  yield takeEvery(INSERT_USER_VIEW, workerInsertUserViewSaga)
}

function * workerInsertUserViewSaga(action) {
  try {
    const response = yield call(request, '/insertUserView', { method: 'GET', credentials: 'include' })

    if (response === undefined || response.status !== 1) {
      // yield put({ type: INSERT_USER_VIEW_SUCCESS, payload: response.error.message })
    } else {
      yield put({ type: INSERT_USER_VIEW_SUCCESS, payload: response.data })
    }
  } catch (e) {
    // yield put({ type: INSERT_USER_FAILED, payload: 'Generic Error! Please try again in few minutes' })
  }
}
