import AsyncStorage from '@react-native-community/async-storage';
import { takeEvery, put, call, select } from 'redux-saga/effects';
import request from '../../utils/request';
import { selectUser } from '../App/selector';

import {
  CHECK_USER, CHECK_USER_SUCCESS,
  LOGIN, LOGIN_SUCCESS, LOGIN_ERROR,
  LOGOUT, LOGOUT_SUCCESS,
  UPLOAD_IMG, UPLOAD_IMG_SUCCESS, UPLOAD_IMG_ERROR,
} from './reducer';
import { API } from '../../constants/api';

export default function* watcherAppSaga() {
  yield takeEvery(CHECK_USER, workerCheckUserSaga);
  yield takeEvery(LOGIN, workerLoginSaga);
  yield takeEvery(LOGOUT, workerLogoutSaga);
  yield takeEvery(UPLOAD_IMG, workerUploadImgSaga);
}

function* workerCheckUserSaga(action) {
  try {

    const user = yield AsyncStorage.getItem('user');

    yield put({ type: CHECK_USER_SUCCESS, payload: JSON.parse(user) });

  } catch (e) {
  }
}

function* workerLoginSaga(action) {
  try {
    const response = yield call(request, API.LOGIN, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.payload),
    });

    if (response === undefined || response.status !== 1) {
      yield put({ type: LOGIN_ERROR, payload: response.error.message });
    } else {
      console.log("Login data", response.data)
      AsyncStorage.setItem('user', JSON.stringify(response.data));
      yield put({ type: LOGIN_SUCCESS, payload: response.data });
    }

  } catch (e) {
    yield put({ type: LOGIN_ERROR, payload: 'Generic Error! Please try again in few minutes' });
  }
}

function* workerLogoutSaga(action) {
  try {
    const user = yield select(selectUser);

    const response = yield call(request, API.LOGOUT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: user.token }),
    });

    if (response !== undefined || response.status === 1) {
      yield AsyncStorage.removeItem('user');
      yield put({ type: LOGOUT_SUCCESS, payload: true });
    }

  } catch (e) {
  }
}

function* workerUploadImgSaga(action) {
  try {

    const user = yield select(selectUser);
    const uploadData = action.payload.uploadData;
    uploadData.append('token', user.token);
    const requestId = action.payload.requestId;

    const response = yield call(request, API.IMG_UPLOAD, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: uploadData,
    });

    if (response === undefined || response.status !== 1) {
      yield put({ type: UPLOAD_IMG_ERROR, payload: -1 });
    } else {
      yield put({ type: UPLOAD_IMG_SUCCESS, payload: requestId });
    }
  } catch (e) {
    yield put({ type: UPLOAD_IMG_ERROR, payload: -1 });
  }
}
