import { all } from 'redux-saga/effects';

import watcherAppSaga from './containers/App/sagas';
import watcherCreateTagSaga from './containers/CreateTag/sagas';
import watcherOpenTagsSaga from './containers/OpenTags/sagas';
import watcherTaskToDoSaga from './containers/TaskToDo/sagas';
import watcherAuditSaga from './containers/Audit/sagas';
import watcherAchievementsSaga from './containers/Achievements/sagas';

export default function* rootSaga() {
  yield all([
    watcherAppSaga(),
    watcherCreateTagSaga(),
    watcherOpenTagsSaga(),
    watcherTaskToDoSaga(),
    watcherAuditSaga(),
    watcherAchievementsSaga(),
  ]);
}
