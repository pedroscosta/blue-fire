import { createStore } from 'redux';

const INITIAL_STATE = {
  flowState: { nodes: [], edges: [] },
  dataModel: { connections: {} },
  loadedData: { files: {}, tables: {} },
};

const actions = {
  BF_CORE_LOAD_DATA: (action, state) => {
    return {
      ...state,
      loadedData: { files: action.files, tables: action.tables },
    };
  },
  BF_CORE_SAVE_DATA_MODEL: (action, state) => {
    return {
      ...state,
      dataModel: { connections: action.connections },
    };
  },
  BF_CORE_STORE_FLOW_STATE: (action, state) => {
    return {
      ...state,
      flowState: { nodes: action.nodes, edges: action.edges },
    };
  },
};

function reducer(state = INITIAL_STATE, action) {
  if (action.type in actions) {
    return actions[action.type](action, state);
  }
  return state;
}

const store = createStore(reducer);

export default store;
