const actions = {
  BF_CORE_LOAD_DATA: (state, action) => {
    return {
      ...state,
      tables: action.tables,
    };
  },
};

export default (state, action) => {
  if (action.type in actions) {
    return actions[action.type](state, action);
  }
  return state;
};
