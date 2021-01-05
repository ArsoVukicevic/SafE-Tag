import { takeEvery, put, call, select } from 'redux-saga/effects';
import request from '../../utils/request';
import { selectUser } from '../App/selector';
import { API } from '../../constants/api';

import {
  GET_OPEN_TAGS, GET_OPEN_TAGS_SUCCESS, GET_OPEN_TAGS_ERROR,
  GET_TAGS_COUNT, GET_TAGS_COUNT_SUCCESS, GET_TAGS_COUNT_ERROR,
  GET_OPEN_TAG_DETAILS, GET_OPEN_TAG_DETAILS_SUCCESS, GET_OPEN_TAG_DETAILS_ERROR,
  SET_EMPLOYEES_ERROR, SET_EMPLOYEES_SUCESS, GET_EMPLOYEES,
  ASSIGN_TAG, ASSIGN_TAG_ERROR, ASSIGN_TAG_SUCESS,
} from './reducer';
import { selectTagId } from './selector';
import { CHECK_IS_SEASION_EXPIRED } from '../App/reducer';

export default function* watcherOpenTagsSaga() {
  yield takeEvery(GET_OPEN_TAGS, workerGetOpenTagsSaga);
  yield takeEvery(GET_TAGS_COUNT, workerGetTagsCountSaga);
  yield takeEvery(GET_OPEN_TAG_DETAILS, workerOpenTagDetailsSaga);
  yield takeEvery(GET_EMPLOYEES, workerGetEmployeesSaga);
  yield takeEvery(ASSIGN_TAG, workerAssignTagSaga);
}

function* workerGetOpenTagsSaga(action) {
  try {
    const user = yield select(selectUser);

    const response = yield call(request, API.OPEN_TAGS, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: user.token }),
    });

    if (response === undefined || response.status !== 1) {
      yield put({ type: GET_OPEN_TAGS_ERROR, payload: response.error.message });
    } else {
      yield put({ type: GET_OPEN_TAGS_SUCCESS, payload: response.data });
    }

  } catch (e) {
    e.sessionExpired
      ? yield put({ type: CHECK_IS_SEASION_EXPIRED, payload: e.message })
      : yield put({ type: GET_OPEN_TAGS_ERROR, payload: 'Generic Error! Please try again in few minutes' });
  }
}

function* workerGetTagsCountSaga(action) {
  try {
    const user = yield select(selectUser);

    const response = yield call(request, API.TAGS_COUNT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: user.token }),
    });
    if (response === undefined || response.status !== 1) {
      yield put({ type: GET_TAGS_COUNT_ERROR, payload: response.error.message });
    } else {
      yield put({ type: GET_TAGS_COUNT_SUCCESS, payload: response.data });
    }

  } catch (e) {
    e.sessionExpired
      ? yield put({ type: CHECK_IS_SEASION_EXPIRED, payload: e.message })
      : yield put({ type: GET_TAGS_COUNT_ERROR, payload: 'Generic Error! Please try again in few minutes' });
  }
}

function* workerOpenTagDetailsSaga(action) {
  try {
    const user = yield select(selectUser);

    const response = yield call(request, API.OPEN_TAGS_DETAILS, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tagId: action.payload, token: user.token }),
    });

    if (response === undefined || response.status !== 1) {
      yield put({ type: GET_OPEN_TAG_DETAILS_ERROR, payload: response.error.message });
    } else {
      yield put({
        type: GET_OPEN_TAG_DETAILS_SUCCESS, payload: {
          openTagDetails: response.data,
          tagId: action.payload,
        },
      });
    }

  } catch (e) {
    e.sessionExpired
      ? yield put({ type: CHECK_IS_SEASION_EXPIRED, payload: e.message })
      : yield put({ type: GET_OPEN_TAG_DETAILS_ERROR, payload: 'Generic Error! Please try again in few minutes' });
  }
}

function* workerGetEmployeesSaga(action) {
  try {
    const user = yield select(selectUser);

    const response = yield call(request, API.EMPLOYEES, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: user.token }),
    });
    if (response === undefined || response.status !== 1) {
      yield put({ type: SET_EMPLOYEES_ERROR, payload: response.error.message });
    } else {
      yield put({ type: SET_EMPLOYEES_SUCESS, payload: response.data });
    }

  } catch (e) {
    e.sessionExpired
      ? yield put({ type: CHECK_IS_SEASION_EXPIRED, payload: e.message })
      : yield put({ type: SET_EMPLOYEES_ERROR, payload: 'Generic Error! Please try again in few minutes' });
  }
}

function* workerAssignTagSaga(action) {
  try {
    const user = yield select(selectUser);
    const tagId = yield select(selectTagId);

    const response = yield call(request, API.ASSIGN_TAG, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: user.token, tagId, msgs: action.payload.msgs, employeeId: action.payload.employeeId }),
    });
    if (response === undefined || response.status !== 1) {
      yield put({ type: ASSIGN_TAG_ERROR, payload: response.error.message });
    } else {
      yield put({ type: ASSIGN_TAG_SUCESS, payload: response.data });
    }

    action.payload.history.goBack();
  } catch (e) {
    if (e.sessionExpired) {
      yield put({ type: CHECK_IS_SEASION_EXPIRED, payload: e.message });
    } else {
      yield put({ type: ASSIGN_TAG_ERROR, payload: 'Generic Error! Please try again in few minutes' });
      action.payload.history.goBack();
    }
  }
}
