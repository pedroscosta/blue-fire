/* eslint-disable spaced-comment */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Module {
  name: string;
  version: string;
  author: string;
  main: string;
  enabled: boolean;
}

export interface ModulesState {
  [index: string]: Module;
}

const INITIAL_STATE: ModulesState = {};

export const loadModules = createAsyncThunk(
  'modules/loadModules',
  async (folder: string, thunkAPI) => {
    const modules = await bfCore.discoverModules(folder);
    const a = 'D:/Projects/Electron/blue-fire/src/modules/charts/main'; //a
    console.log('test');
    console.log(
      'test2',
      __non_webpack_require__(
        'D:/Projects/Electron/blue-fire/src/modules/charts/main.js'
      )
    ); //a

    // console.log(
    //   // eslint-disable-next-line spaced-comment, prefer-template
    //   await import(/*webpackIgnore: true*/ `modules/${modules[0]}/package.json`)
    // );
  }
);

const ModulesSlice = createSlice({
  name: 'modules',
  initialState: INITIAL_STATE,
  reducers: {
    loadModule(state, { payload }: PayloadAction<string>) {
      return state;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(loadModules.fulfilled, (state, action) => {
      // Add user to the state array
      // state.entities.push(action.payload);
    });
  },
});

export default ModulesSlice.reducer;

// export const { loadModules } = ModulesSlice.actions;
