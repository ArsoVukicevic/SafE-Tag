import { fromJS } from 'immutable';
import { createAction } from 'redux-actions';
import AsyncStorage from '@react-native-community/async-storage';

export const CHECK_USER = 'APP@@CHECK_USER';
export const CHECK_USER_SUCCESS = 'APP@@CHECK_USER_SUCCESS';

export const LOGIN = 'APP@@LOGIN';
export const LOGIN_SUCCESS = 'APP@@LOGIN_SUCCESS';
export const LOGIN_ERROR = 'APP@@LOGIN_ERROR';

export const LOGOUT = 'APP@@LOGOUT';
export const LOGOUT_SUCCESS = 'APP@@LOGOUT_SUCCESS';
export const LOGOUT_ERROR = 'APP@@LOGOUT_ERROR';

export const UPLOAD_IMG = 'APP@@UPLOAD_IMG';
export const UPLOAD_IMG_SUCCESS = 'APP@@UPLOAD_IMG_SUCCESS';
export const UPLOAD_IMG_ERROR = 'APP@@UPLOAD_IMG_ERROR';

export const SET_WS = 'APP@@SET_WS';
export const WS_ON_MSG_RECEIVED = 'APP@@WS_ON_MSG_RECEIVED';

export const FORCE_OPEN_CORRESPONDENCE = 'APP@@FORCE_OPEN_CORRESPONDENCE';

export const CHECK_IS_SEASION_EXPIRED = 'APP@@CHECK_IS_SEASION_EXPIRED';

const initialState = fromJS({
  user: null,
  loginErrorMsg: null,
  loading: true,
  ws: null,
  wsMsgReceived: null,
  imageUploaded: null,
  forceOpenCorrespondence: null,
});

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case CHECK_USER_SUCCESS:
    case LOGIN_SUCCESS:
      return state
        .set('user', action.payload)
        .set('loading', false);
    case LOGOUT_SUCCESS:
      return state.set('user', null);
    case LOGIN:
      return state
        .set('loginErrorMsg', null);
    case LOGIN_ERROR:
      return state
        .set('loginErrorMsg', action.payload)
        .set('loading', false);
    case SET_WS:
      return state.set('ws', action.payload);
    case FORCE_OPEN_CORRESPONDENCE:
      return state.set('forceOpenCorrespondence', action.payload);
    case WS_ON_MSG_RECEIVED:
      return state.set('wsMsgReceived', action.payload);
    case UPLOAD_IMG:
      return state.set('imageUploaded', null);
    case UPLOAD_IMG_SUCCESS:
    case UPLOAD_IMG_ERROR:
      return state.set('imageUploaded', action.payload);
    case CHECK_IS_SEASION_EXPIRED:
      AsyncStorage.removeItem('user');
      return state
        .set('user', null)
        .set('loginErrorMsg', action.payload);

    default:
      return state;
  }
}

export const checkUserAction = createAction(CHECK_USER);
export const loginAction = createAction(LOGIN);
export const logoutAction = createAction(LOGOUT);
export const uploadImgAction = createAction(UPLOAD_IMG);
export const setWSAction = createAction(SET_WS);
export const onMsgReceivedWSAction = createAction(WS_ON_MSG_RECEIVED);
export const forceOpenCorrespondenceAction = createAction(FORCE_OPEN_CORRESPONDENCE);
