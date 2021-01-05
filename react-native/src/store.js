import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import mySagas from './sagas';
import reducers from './reducers';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// mount it on the Store
const store = createStore(reducers, applyMiddleware(sagaMiddleware));

// then run the saga
sagaMiddleware.run(mySagas);

export default store;
