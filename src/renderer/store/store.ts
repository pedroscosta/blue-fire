/* eslint-disable no-underscore-dangle */
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const INITIAL_STATE = {
  flowState: { nodes: [], edges: [] },
  dataModel: { tables: {}, connections: {} },
  loadedData: { tables: {} },
  projectData: {},
  charts: {},
};

const actions = {};

// const reducer = (state = INITIAL_STATE, action) => ({
//   ...ProjectDataReducer(state, action), // This is a reducer that affects all the store
//   flowState: FlowStateReducer(state.flowState, action),
//   dataModel: DataModelReducer(state.dataModel, action),
//   loadedData: LoadedDataReducer(state.loadedData, action),
// });

// const store = createStore(
//   reducer,
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

const store = configureStore({
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
