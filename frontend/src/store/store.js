


import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import sessionReducer from './session';
import applicationsReducer from './applications'; 
import notesReducer from './notes';
import jobsReducer from './jobs';
import resumesReducer from './resumes';

const rootReducer = combineReducers({
  session: sessionReducer,
  applications: applicationsReducer,
  notes: notesReducer,
  jobs: jobsReducer,
  resumes: resumesReducer,
  // add more reducers here as needed
});

let enhancer;

if (import.meta.env.MODE === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  let logger;
  try {
    logger = require('redux-logger').default;
  } catch (error) {
    console.warn('redux-logger not installed. Skipping logger middleware.');
    logger = (store) => (next) => (action) => next(action); // dummy pass-through logger
  }

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;

