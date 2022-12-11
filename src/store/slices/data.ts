import { lens } from '@dhmk/zustand-lens';

export interface DataSource {
  location: string;
  columns: string[];
}

export interface DagData {
  [index: string]: { top: number; left: number };
}

export interface LoadedData {
  fields: Record<string, string>;
  tables: Record<string, any>; // TODO: Add a precise type for table object
}

interface State {
  dataSources: { [index: string]: DataSource };
  dataModel: {
    dag: DagData;
    connections: { [index: string]: string };
  };
  loadedState: LoadedData & {
    filters: any[]; // TODO: Add a precise type for filter object
  };
}

const initialState: State = {
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
};

interface Actions {
  createDataSource: (name: string, source: DataSource) => void;
  removeDataSource: (name: string) => void;
  setDagData: (data: { [index: string]: { top: number; left: number } }) => void;
  loadData: (data: LoadedData) => void;
}

export default lens<State & Actions>((set) => {
  return {
    ...initialState,

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
  };
});
