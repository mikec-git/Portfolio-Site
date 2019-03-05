import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../Reducers/index';
import rootSaga from '../Sagas/index';

export default function initStore() {
  const sagaMiddleware  = createSagaMiddleware();
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));
  // const middleWare      = applyMiddleware(sagaMiddleware);
  // const store           = createStore(rootReducer, middleWare);

  sagaMiddleware.run(rootSaga);
  return store;
}