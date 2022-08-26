const actions = {
  BF_CORE_LOAD_PROJECT: (state, action) => {
    return {
      ...action.fileData,
      projectData: { ...action.fileData.projectData, path: action.filePath },
    };
  },

  BF_CORE_SET_CUR_PROJ_PATH: (state, action) => {
    return {
      ...state,
      projectData: { ...state.projectData, path: action.path },
    };
  },
};

export default (state, action) => {
  if (action.type in actions) {
    return actions[action.type](state, action);
  }
  return state;
};
