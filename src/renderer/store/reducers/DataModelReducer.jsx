const actions = {
  BF_CORE_ADD_DATA_SOURCE: (state, action) => {
    return {
      ...state,
      tables: {
        ...state.tables,
        [action.table]: { file: action.file, columns: action.columns },
      },
    };
  },

  BF_CORE_SAVE_DATA_MODEL: (state, action) => {
    return {
      ...state,
      connections: action.connections,
    };
  },
};

export default (state, action) => {
  if (action.type in actions) {
    return actions[action.type](state, action);
  }
  return state;
};
