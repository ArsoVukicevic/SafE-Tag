import { takeEvery, put, call, select } from 'redux-saga/effects';
import request from '../../utils/request';
import { selectUser } from '../App/selector';
import { API } from '../../constants/api';

import { GET_AUDIT, SET_AUDIT_STATUS, GET_AUDIT_ERROR, GET_AUDIT_SUCCESS, SET_AUDIT_STATUS_ERROR, SET_AUDIT_STATUS_SUCCESS } from './reducer';
import { CHECK_IS_SEASION_EXPIRED } from '../App/reducer';

export default function* watcherAuditSaga() {
  yield takeEvery(GET_AUDIT, workerAuditSaga);
  yield takeEvery(SET_AUDIT_STATUS, workerSetStatusSaga);
}

function* workerAuditSaga(action) {
  try {
    const user = yield select(selectUser);

    const response = yield call(request, API.AUDIT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: user.token }),
    });

    if (response === undefined || response.status !== 1) {
      yield put({ type: GET_AUDIT_ERROR, payload: response.error.message });
    } else {
      yield put({ type: GET_AUDIT_SUCCESS, payload: response.data });
    }

  } catch (e) {
    e.sessionExpired
      ? yield put({ type: CHECK_IS_SEASION_EXPIRED, payload: e.message })
      : yield put({ type: GET_AUDIT_ERROR, payload: 'Generic Error! Please try again in few minutes' });
  }
}


function* workerSetStatusSaga(action) {
  try {
    const user = yield select(selectUser);

    const response = yield call(request, API.AUDIT_STATUS, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: user.token, audit: action.payload.audit, auditId: action.payload.auditId }),
    });
    if (response === undefined || response.status !== 1) {
      yield put({ type: SET_AUDIT_STATUS_ERROR, payload: response.error.message });
    } else {
      yield put({ type: SET_AUDIT_STATUS_SUCCESS, payload: action.payload });
    }

  } catch (e) {
    yield put({ type: SET_AUDIT_STATUS_ERROR, payload: 'Generic Error! Please try again in few minutes' });
  }
}
