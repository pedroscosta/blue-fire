/* eslint-disable no-underscore-dangle */
import { createStore } from 'redux';

import FlowStateReducer from './reducers/FlowStateReducer';
import DataModelReducer from './reducers/DataModelReducer';
import LoadedDataReducer from './reducers/LoadedDataReducer';
import ProjectDataReducer from './reducers/ProjectDataReducer';

const INITIAL_STATE = {
  flowState: { nodes: [], edges: [] },
  dataModel: { tables: {}, connections: {} },
  loadedData: { tables: {} },
  projectData: {},
};

const actions = {};

const reducer = (state = INITIAL_STATE, action) => ({
  ...ProjectDataReducer(state, action), // This is a reducer that affects all the store
  flowState: FlowStateReducer(state.flowState, action),
  dataModel: DataModelReducer(state.dataModel, action),
  loadedData: LoadedDataReducer(state.loadedData, action),
});

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
