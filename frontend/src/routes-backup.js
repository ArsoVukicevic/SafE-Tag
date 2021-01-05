import { injectReducer } from 'redux-injector';
import { injectSaga } from 'redux-sagas-injector';

const loadModule = (cb) => (componentModule) => {
    cb(null, componentModule.default);
};

export default function createRoutes(store) {
    return [
        {
            path: '/',
            name: 'home',
            getComponent(nextState, cb) {
                const renderRoute = loadModule(cb);

                // let reducer = require('App/reducer');
                // let sagas = require('App/sagas');
                let component = require('App/');

                // injectReducer('home', reducer.default);
                // injectSaga('home', sagas.default);
                renderRoute(component);
            },
        }
    ];
}