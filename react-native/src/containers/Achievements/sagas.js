import { takeEvery, put, call, select } from 'redux-saga/effects';
import request from '../../utils/request';
import { selectUser } from '../App/selector';
import { API } from '../../constants/api';

import { GET_ACHIEVEMENTS, GET_ACHIEVEMENTS_ERROR, GET_ACHIEVEMENTS_SUCCESS } from './reducer';
import { CHECK_IS_SEASION_EXPIRED } from '../App/reducer';

export default function* watcherAchievementsSaga() {
  yield takeEvery(GET_ACHIEVEMENTS, workerAchievementsSaga);
}

function* workerAchievementsSaga(action) {
  try {
    const user = yield select(selectUser);

    const response = yield call(request, API.ACHIEVEMENTS, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: user.token }),
    });
    if (response === undefined || response.status !== 1) {
      yield put({ type: GET_ACHIEVEMENTS_ERROR, payload: response.error.message });
    } else {
      yield put({
        type: GET_ACHIEVEMENTS_SUCCESS,
        payload: response.data,
      });
    }

  } catch (e) {
    e.sessionExpired
      ? yield put({ type: CHECK_IS_SEASION_EXPIRED, payload: e.message })
      : yield put({ type: GET_ACHIEVEMENTS_ERROR, payload: 'Generic Error! Please try again in few minutes' });
  }
}
