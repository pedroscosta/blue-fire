import { lens } from '@dhmk/zustand-lens';
import { BluefireState, DataSource, LoadedData } from 'bluefire';

export default lens<BluefireState['data']>((set, get) => {
  return {
    dataSources: {},
    dataModel: {
      dag: {},
      connections: {},
    },
    loadedState: {
      fields: {},
      tables: {},
      filters: [],
    },

    createDataSource: (name: string, source: DataSource) => {
      set((draft) => {
        if (draft.dataSources[name]) return;

        draft.dataSources[name] = source;
        draft.dataModel.dag[name] = { left: 0, top: 0 };
      });
    },

    removeDataSource: (name: string) => {
      set((draft) => {
        if (!draft.dataSources[name]) return;

        delete draft.dataSources[name];
        delete draft.dataModel.dag[name];
        draft.dataModel.connections = Object.fromEntries(
          Object.entries(draft.dataModel.connections).filter(([k, v]) => k != name && v != name),
        );
      });
    },

    loadData: (data: LoadedData) => {
      set((draft) => {
        draft.loadedState = {
          filters: draft.loadedState.filters,
          ...data,
        };
      });
    },

    setDagData: (data: { [index: string]: { top: number; left: number } }) => {
      set((draft) => {
        draft.dataModel.dag = data;
      });
    },

    queryColumn: (col) => {
      const state = get().loadedState;
      const tblName = state.fields[col];

      if (!tblName || !state.tables[tblName]) return undefined;

      return Object.entries(state.tables[tblName]).map(([k, v]) => (v as any)[col]);
    },
  };
});
