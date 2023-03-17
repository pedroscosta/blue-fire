import { lens } from '@dhmk/zustand-lens';
import { ChartData } from 'bluefire';

interface State {
  sheets: Record<string, Record<string, ChartData>>;
}

interface Actions {
  updateChart: (
    tab: string,
    id: string,
    data: ChartData | ((past: ChartData) => ChartData),
  ) => void;
  removeChart: (tab: string, id: string) => void;
}

const initialState: State = {
  sheets: {},
};

export default lens<State & Actions>((set) => {
  return {
    ...initialState,

    updateChart: (tab: string, id: string, data: ChartData | ((past: ChartData) => ChartData)) => {
      set((draft) => {
        if (!draft.sheets[tab]) draft.sheets[tab] = {};

        draft.sheets[tab][id] =
          typeof data === 'function' ? data(draft.sheets[tab][id] || {}) : data;
      });
    },

    removeChart: (tab: string, id: string) => {
      set((draft) => {
        delete draft.sheets[tab]?.[id];
      });
    },
  };
});
