import { fromJS } from 'immutable';
import { createAction } from 'redux-actions';
import { RESOLVE_TAG_SUCCESS } from '../TaskToDo/reducer';

export const GET_OPEN_TAGS = 'OPEN_TAGS@@GET_OPEN_TAGS';
export const GET_OPEN_TAGS_SUCCESS = 'OPEN_TAGS@@GET_OPEN_TAGS_SUCCESS';
export const GET_OPEN_TAGS_ERROR = 'OPEN_TAGS@@GET_OPEN_TAGS_ERROR';

export const GET_TAGS_COUNT = 'OPEN_TAGS@@GET_TAGS_COUNT';
export const GET_TAGS_COUNT_SUCCESS = 'OPEN_TAGS@@GET_TAGS_COUNT_SUCCESS';
export const GET_TAGS_COUNT_ERROR = 'OPEN_TAGS@@GET_TAGS_COUNT_ERROR';

export const INCREMENT_OPEN_TAGS_COUNT = 'OPEN_TAGS@@INCREMENT_OPEN_TAGS_COUNT';
export const INCREMENT_TASK_TODO_COUNT = 'OPEN_TAGS@@INCREMENT_TASK_TODO_COUNT';
export const INCREMENT_ASSIGNED_ON_ME = 'OPEN_TAGS@@INCREMENT_ASSIGNED_ON_ME';

export const GET_OPEN_TAG_DETAILS = 'OPEN_TAGS@@GET_OPEN_TAG_DETAILS';
export const GET_OPEN_TAG_DETAILS_SUCCESS = 'OPEN_TAGS@@GET_OPEN_TAG_DETAILS_SUCCESS';
export const GET_OPEN_TAG_DETAILS_ERROR = 'OPEN_TAGS@@GET_OPEN_TAG_DETAILS_ERROR';

export const GET_EMPLOYEES = 'OPEN_TAGS@@GET_EMPLOYEES';
export const SET_EMPLOYEES_SUCESS = 'OPEN_TAGS@@SET_EMPLOYEES_SUCESS';
export const SET_EMPLOYEES_ERROR = 'OPEN_TAGS@@SET_EMPLOYEES_ERROR';

export const ASSIGN_TAG = 'OPEN_TAGS@@ASSIGN_TAG';
export const ASSIGN_TAG_SUCESS = 'OPEN_TAGS@@ASSIGN_TAG_SUCESS';
export const ASSIGN_TAG_ERROR = 'OPEN_TAGS@@ASSIGN_TAG_ERROR';


const initialState = fromJS({
  serverError: null,
  openTags: null,
  openTagsCount: null,
  homeTaskToDoCount: null,
  taskToDoCountOnMe: null,
  taskToDoCountByMe: null,
  openTagDetails: null,
  selectedTag: null,
  employees: null,
  assinTagSuccess: false,
  assinTagError: null,
});

export default function openTagsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_OPEN_TAGS:
      return state
        .set('serverError', null)
        .set('openTags', null);
    case GET_OPEN_TAG_DETAILS:
      return state
        .set('serverError', null)
        .set('openTagDetails', null);
    case GET_OPEN_TAGS_SUCCESS:
      return state
        .set('openTags', action.payload)
        .set('openTagsCount', action.payload.length);
    case GET_OPEN_TAGS_ERROR:
    case SET_EMPLOYEES_ERROR:
    case GET_OPEN_TAG_DETAILS_ERROR:
      return state.set('serverError', action.payload);
    case RESOLVE_TAG_SUCCESS:
    case GET_TAGS_COUNT_SUCCESS:
      return state
        .set('openTagsCount', action.payload.openTagsCount)
        .set('homeTaskToDoCount', action.payload.taskToDoCount + action.payload.taskToDoAsignByMeCount)
        .set('taskToDoCountOnMe', action.payload.taskToDoCount)
        .set('taskToDoCountByMe', action.payload.taskToDoAsignByMeCount);
    case INCREMENT_OPEN_TAGS_COUNT:
      const currCount = state.get('openTagsCount');
      return state.set('openTagsCount', currCount + 1);
    case INCREMENT_TASK_TODO_COUNT:
      const toDoCount = state.get('homeTaskToDoCount');
      const countOnMe = state.get('taskToDoCountOnMe');
      const openTagsCount = state.get('openTagsCount');
      return state
        .set('homeTaskToDoCount', toDoCount + 1)
        .set('taskToDoCountOnMe', countOnMe + 1)
        .set('openTagsCount', openTagsCount - 1);
    case INCREMENT_ASSIGNED_ON_ME:
      const homeTaskToDoCount = state.get('homeTaskToDoCount');
      const taskToDoCountOnMe = state.get('taskToDoCountOnMe');
      return state
        .set('homeTaskToDoCount', homeTaskToDoCount + 1)
        .set('taskToDoCountOnMe', taskToDoCountOnMe + 1);
    case GET_OPEN_TAG_DETAILS_SUCCESS:
      return state
        .set('openTagDetails', action.payload.openTagDetails)
        .set('selectedTag', action.payload.tagId);
    case GET_EMPLOYEES:
      return state
        .set('employees', null)
        .set('serverError', null);
    case SET_EMPLOYEES_SUCESS:
      return state.set('employees', action.payload);
    case ASSIGN_TAG:
      return state
        .set('assinTagSuccess', false)
        .set('assinTagError', null);
    case ASSIGN_TAG_SUCESS:
      return state
        .set('assinTagSuccess', true)
        .set('openTagsCount', action.payload.openTagsCount)
        .set('homeTaskToDoCount', action.payload.taskToDoCount + action.payload.taskToDoAsignByMeCount)
        .set('taskToDoCountOnMe', action.payload.taskToDoCount)
        .set('taskToDoCountByMe', action.payload.taskToDoAsignByMeCount);
    case ASSIGN_TAG_ERROR:
      return state
        .set('assinTagError', action.payload);

    default:
      return state;
  }
}

export const getOpenTagsAction = createAction(GET_OPEN_TAGS);
export const getTagsCountAction = createAction(GET_TAGS_COUNT);
export const incrementOpenTagsCountAction = createAction(INCREMENT_OPEN_TAGS_COUNT);
export const incrementTaskToDoCountAction = createAction(INCREMENT_TASK_TODO_COUNT);
export const getOpenTagsDetailsAction = createAction(GET_OPEN_TAG_DETAILS);
export const getEmployeesAction = createAction(GET_EMPLOYEES);
export const assignTagAction = createAction(ASSIGN_TAG);
