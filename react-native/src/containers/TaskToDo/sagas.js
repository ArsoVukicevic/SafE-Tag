import { takeEvery, put, call, select } from 'redux-saga/effects';
import request from '../../utils/request';
import { selectUser } from '../App/selector';
import { API } from '../../constants/api';

import {
  GET_TASK_TO_DO, GET_TASK_TO_DO_ERROR, GET_TASK_TO_DO_SUCCESS, RESOLVE_TAG, RESOLVE_TAG_ERROR, RESOLVE_TAG_SUCCESS,
} from './reducer';
import { CHECK_IS_SEASION_EXPIRED } from '../App/reducer';


export default function* watcherTaskToDoSaga() {
  yield takeEvery(GET_TASK_TO_DO, workerGetTaskToDoSaga);
  yield takeEvery(RESOLVE_TAG, workerResolveTagSaga);
}

function* workerGetTaskToDoSaga(action) {
  try {
    const user = yield select(selectUser);

    const response = yield call(request, API.TASK_TO_DO, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: user.token, assignByMe: action.payload }),
    });
    if (response === undefined || response.status !== 1) {
      yield put({ type: GET_TASK_TO_DO_ERROR, payload: response.error.message });
    } else {
      yield put({ type: GET_TASK_TO_DO_SUCCESS, payload: response.data });
    }

  } catch (e) {
    e.sessionExpired
      ? yield put({ type: CHECK_IS_SEASION_EXPIRED, payload: e.message })
      : yield put({ type: GET_TASK_TO_DO_ERROR, payload: 'Generic Error! Please try again in few minutes' });
  }
}

function* workerResolveTagSaga(action) {
  try {
    const user = yield select(selectUser);

    const response = yield call(request, API.RESOLVE_TAG, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: user.token, tagId: action.payload.tag }),
    });
    if (response === undefined || response.status !== 1) {
      yield put({ type: RESOLVE_TAG_ERROR, payload: response.error.message });
    } else {
      yield put({ type: RESOLVE_TAG_SUCCESS, payload: response.data });
    }
    action.payload.callback(-2);

  } catch (e) {
    if (e.sessionExpired) {
      yield put({ type: CHECK_IS_SEASION_EXPIRED, payload: e.message });
    } else {
      yield put({ type: RESOLVE_TAG_ERROR, payload: 'Generic Error! Please try again in few minutes' });
      action.payload.callback(-2);
    }
  }
}
