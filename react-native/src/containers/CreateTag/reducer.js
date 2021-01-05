import { fromJS } from 'immutable';
import { createAction } from 'redux-actions';

export const GET_ITEM_TREE = 'CREATE_TAG@@GET_ITEM_TREE';
export const GET_ITEM_TREE_SUCCESS = 'CREATE_TAG@@GET_ITEM_TREE_SUCCESS';
export const GET_ITEM_TREE_ERROR = 'CREATE_TAG@@GET_ITEM_TREE_ERROR';

export const GET_CLASSIFICATION_TREE = 'CREATE_TAG@@GET_CLASSIFICATION_TREE';
export const GET_CLASSIFICATION_TREE_SUCCESS = 'CREATE_TAG@@GET_CLASSIFICATION_TREE_SUCCESS';
export const GET_CLASSIFICATION_TREE_ERROR = 'CREATE_TAG@@GET_CLASSIFICATION_TREE_ERROR';

export const OPEN_TAG = 'CREATE_TAG@@OPEN_TAG';
export const OPEN_TAG_SUCCESS = 'CREATE_TAG@@OPEN_TAG_SUCCESS';
export const OPEN_TAG_ERROR = 'CREATE_TAG@@OPEN_TAG_ERROR';

const initialState = fromJS({
  serverError: null,
  locations: null,
  classifications: null,
  openTagError: null,
  openTagSuccess: false,
});

export default function createTagReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ITEM_TREE:
    case GET_CLASSIFICATION_TREE:
      return state.set('serverError', null);
    case GET_ITEM_TREE_SUCCESS:
      return state.set('locations', action.payload);
    case GET_ITEM_TREE_ERROR:
      return state
        .set('serverError', action.payload);
    case GET_CLASSIFICATION_TREE_SUCCESS:
      return state.set('classifications', action.payload);
    case OPEN_TAG_ERROR:
      return state.set('openTagError', action.payload);
    case OPEN_TAG_SUCCESS:
      return state.set('openTagSuccess', true);
    case OPEN_TAG:
      return state
        .set('openTagError', null)
        .set('openTagSuccess', false);
    default:
      return state;
  }
}

export const getItemTreeAction = createAction(GET_ITEM_TREE);
export const getClassificationTreeAction = createAction(GET_CLASSIFICATION_TREE);
export const openTagAction = createAction(OPEN_TAG);
