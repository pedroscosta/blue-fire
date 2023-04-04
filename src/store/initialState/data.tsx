import { BluefireState } from 'bluefire';

const initialState: Partial<BluefireState['data']> = {
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

export default initialState;
