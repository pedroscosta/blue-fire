const actions = {
  BF_CORE_STORE_FLOW_STATE: (action, state) => {
    return {
      ...state,
      nodes: action.nodes,
      edges: action.edges,
    };
  },
};

export default (state, action) => {
  if (action.type in actions) {
    return actions[action.type](state, action);
  }
  return state;
};
