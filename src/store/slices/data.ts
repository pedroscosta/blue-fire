import { lens } from '@dhmk/zustand-lens';

export interface DataSource {
  location: string;
  columns: string[];
}

export interface DagData {
  [index: string]: { top: number; left: number };
}

interface State {
  dataSources: { [index: string]: DataSource };
  dataModel: {
    dag: DagData;
    connections: { [index: string]: string };
  };
  loadedState: {
    fields: { [index: string]: string };
    tables: { [index: string]: any }; // TODO: Add a precise type for table object
    filters: any[]; // TODO: Add a precise type for filter object
  };
}

const initialState: State = {
  dataSources: {
    books: { location: '', columns: ['id', 'author', 'name', 'sales'] },
  },
  dataModel: {
    dag: { books: { top: 0, left: 0 } },
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

    setDagData: (data: { [index: string]: { top: number; left: number } }) => {
      set((draft) => {
        draft.dataModel.dag = data;
      });
    },
  };
});
