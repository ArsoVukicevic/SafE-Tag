import { all } from 'redux-saga/effects'

import appSaga from './containers/App/sagas'
import authSaga from './containers/Auth/sagas'
import adminSaga from './containers/Admin/sagas'

export default function * rootSaga() {
  yield all([
    appSaga(),
    authSaga(),
    adminSaga()
  ])
}
