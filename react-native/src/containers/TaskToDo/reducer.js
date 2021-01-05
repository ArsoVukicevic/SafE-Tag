import { fromJS } from 'immutable';
import { createAction } from 'redux-actions';
import { GET_OPEN_TAG_DETAILS, GET_OPEN_TAG_DETAILS_SUCCESS } from '../OpenTags/reducer';

export const GET_TASK_TO_DO = 'TASK_TO_DO@@GET_TASK_TO_DO';
export const GET_TASK_TO_DO_SUCCESS = 'TASK_TO_DO@@GET_TASK_TO_DO_SUCCESS';
export const GET_TASK_TO_DO_ERROR = 'TASK_TO_DO@@GET_TASK_TO_DO_ERROR';

export const RESOLVE_TAG = 'TASK_TO_DO@@RESOLVE_TAG';
export const RESOLVE_TAG_SUCCESS = 'TASK_TO_DO@@RESOLVE_TAG_SUCCESS';
export const RESOLVE_TAG_ERROR = 'TASK_TO_DO@@RESOLVE_TAG_ERROR';

const initialState = fromJS({
  taskToDo: null,
  selectedTag: null,
  taskToDoDetails: null,
  resolveError: null,
  resolveSuccess: false,
  serverError: null,
});

export default function taskToDoReducer(state = initialState, action) {
  switch (action.type) {
    case GET_TASK_TO_DO:
      return state
        .set('taskToDo', null)
        .set('serverError', null);
    case GET_OPEN_TAG_DETAILS:
      return state
        .set('taskToDoDetails', null);
    case GET_TASK_TO_DO_SUCCESS:
      return state
        .set('taskToDo', action.payload);
    case GET_TASK_TO_DO_ERROR:
      return state
        .set('serverError', action.payload);
    case GET_OPEN_TAG_DETAILS_SUCCESS:
      return state
        .set('taskToDoDetails', action.payload.openTagDetails)
        .set('selectedTag', action.payload.tagId);
    case RESOLVE_TAG:
      return state
        .set('resolveError', null)
        .set('resolveSuccess', false);
    case RESOLVE_TAG_ERROR:
      return state
        .set('resolveError', action.payload);
    case RESOLVE_TAG_SUCCESS:
      return state
        .set('resolveError', null)
        .set('resolveSuccess', true);
    default:
      return state;
  }
}

export const getTaskToDoAction = createAction(GET_TASK_TO_DO);
export const resolveTagAction = createAction(RESOLVE_TAG);
