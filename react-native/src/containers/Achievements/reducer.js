import { fromJS } from 'immutable';
import { createAction } from 'redux-actions';

export const GET_ACHIEVEMENTS = 'CREATE_TAG@@GET_ACHIEVEMENTS';
export const GET_ACHIEVEMENTS_SUCCESS = 'CREATE_TAG@@GET_ACHIEVEMENTS_SUCCESS';
export const GET_ACHIEVEMENTS_ERROR = 'CREATE_TAG@@GET_ACHIEVEMENTS_ERROR';

const initialState = fromJS({
  achievements: null,
  serverError: null,
});

export default function achievementsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ACHIEVEMENTS_SUCCESS:
      return state
        .set('achievements', action.payload)
        .set('serverError', null);
    case GET_ACHIEVEMENTS_ERROR:
      return state
        .set('serverError', action.payload);
    case GET_ACHIEVEMENTS:
      return state
        .set('serverError', null)
        .set('achievements', null);
    default:
      return state;
  }
}

export const getAchievementsAction = createAction(GET_ACHIEVEMENTS);
