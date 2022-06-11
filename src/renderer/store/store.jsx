/* eslint-disable no-underscore-dangle */
import { createStore } from 'redux';

const INITIAL_STATE = {
  flowState: { nodes: [], edges: [] },
  dataModel: { tables: {}, connections: {} },
  loadedData: { tables: {} },
  projectData: {},
};

const actions = {
  BF_CORE_STORE_FLOW_STATE: (action, state) => {
    return {
      ...state,
      flowState: { nodes: action.nodes, edges: action.edges },
    };
  },
  BF_CORE_ADD_DATA_SOURCE: (action, state) => {
    return {
      ...state,
      dataModel: {
        ...state.dataModel,
        tables: {
          ...state.dataModel.tables,
          [action.table]: { file: action.file, columns: action.columns },
        },
      },
    };
  },
  BF_CORE_LOAD_DATA: (action, state) => {
    return {
      ...state,
      loadedData: { tables: action.tables },
    };
  },
  BF_CORE_SAVE_DATA_MODEL: (action, state) => {
    return {
      ...state,
      dataModel: { connections: action.connections },
    };
  },
  BF_CORE_LOAD_PROJECT: (action, state) => {
    return {
      ...action.fileData,
      projectData: { ...action.fileData.projectData, path: action.filePath },
    };
  },
  BF_CORE_SET_CUR_PROJ_PATH: (action, state) => {
    return {
      ...state,
      projectData: { ...state.projectData, path: action.path },
    };
  },
};

function reducer(state = INITIAL_STATE, action) {
  if (action.type in actions) {
    return actions[action.type](action, state);
  }
  return state;
}

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
