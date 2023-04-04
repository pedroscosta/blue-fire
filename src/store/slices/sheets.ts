import { lens } from '@dhmk/zustand-lens';
import { BluefireState, ChartData } from 'bluefire';

export default lens<BluefireState['sheets']>((set) => {
  return {
    sheets: {},

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
