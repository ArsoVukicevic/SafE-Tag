import { takeEvery, put, call, select } from 'redux-saga/effects';
import request from '../../utils/request';
import { selectUser } from '../App/selector';
import { API } from '../../constants/api';

import {
  GET_ITEM_TREE, GET_ITEM_TREE_SUCCESS, GET_ITEM_TREE_ERROR,
  GET_CLASSIFICATION_TREE, GET_CLASSIFICATION_TREE_SUCCESS, GET_CLASSIFICATION_TREE_ERROR,
  OPEN_TAG, OPEN_TAG_SUCCESS, OPEN_TAG_ERROR,
} from './reducer';
import { INCREMENT_ASSIGNED_ON_ME } from '../OpenTags/reducer';
import { CHECK_IS_SEASION_EXPIRED } from '../App/reducer';

export default function* watcherCreateTagSaga() {
  yield takeEvery(GET_ITEM_TREE, workerGetItemTreeSaga);
  yield takeEvery(GET_CLASSIFICATION_TREE, workerGetClassificationTreeSaga);
  yield takeEvery(OPEN_TAG, workerOpenTagSaga);
}

function* workerGetItemTreeSaga(action) {
  try {
    const user = yield select(selectUser);

    const response = yield call(request, API.ITEM_TREE, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: user.token }),
    });

    if (response === undefined || response.status !== 1) {
      yield put({ type: GET_ITEM_TREE_ERROR, payload: response.error.message });
    } else {
      yield put({ type: GET_ITEM_TREE_SUCCESS, payload: response.data });
    }

  } catch (e) {
    e.sessionExpired
      ? yield put({ type: CHECK_IS_SEASION_EXPIRED, payload: e.message })
      : yield put({ type: GET_ITEM_TREE_ERROR, payload: 'Generic Error! Please try again in few minutes' });
  }
}


function* workerGetClassificationTreeSaga(action) {
  try {
    const user = yield select(selectUser);

    const response = yield call(request, API.CLASSIFICATION_TREE, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: user.token }),
    });


    if (response === undefined || response.status !== 1) {
      yield put({ type: GET_CLASSIFICATION_TREE_ERROR, payload: response.error.message });
    } else {
      yield put({ type: GET_CLASSIFICATION_TREE_SUCCESS, payload: response.data });
    }

  } catch (e) {
    e.sessionExpired
      ? yield put({ type: CHECK_IS_SEASION_EXPIRED, payload: e.message })
      : yield put({ type: GET_CLASSIFICATION_TREE_ERROR, payload: 'Generic Error! Please try again in few minutes' });
  }
}

function* workerOpenTagSaga(action) {
  try {
    const user = yield select(selectUser);
    action.payload.token = user.token;
    const response = yield call(request, API.OPEN_TAG, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.payload),
    });

    if (response === undefined || response.status !== 1) {
      yield put({ type: OPEN_TAG_ERROR, payload: response.error.message });
    } else {
      yield put({ type: OPEN_TAG_SUCCESS, payload: response.data });
      if (action.payload.mode === 'first') {
        yield put({
          type: INCREMENT_ASSIGNED_ON_ME,
        });
      }
    }

  } catch (e) {
    e.sessionExpired
      ? yield put({ type: CHECK_IS_SEASION_EXPIRED, payload: e.message })
      : yield put({ type: OPEN_TAG_ERROR, payload: 'Generic Error! Please try again in few minutes' });
  }
}
