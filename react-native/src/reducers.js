import { combineReducers } from 'redux';

import appReducer from './containers/App/reducer';
import createTagReducer from './containers/CreateTag/reducer';
import openTagsReducer from './containers/OpenTags/reducer';
import taskToDoReducer from './containers/TaskToDo/reducer';
import auditReducer from './containers/Audit/reducer';
import achievementsReducer from './containers/Achievements/reducer';

export default combineReducers({
  app: appReducer,
  createTag: createTagReducer,
  openTags: openTagsReducer,
  taskToDo: taskToDoReducer,
  audit: auditReducer,
  achievements: achievementsReducer,
});
