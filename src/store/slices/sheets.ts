import { PanelData } from '@/components/editor/grid/GridLayout';
import { lens } from '@dhmk/zustand-lens';
import { DataType } from 'bluefire';

export interface ChartData {
  panelData: PanelData;
  type: string;
  series: Record<string, { col: string; type: DataType }>;
  components: Record<string, { component: string; props: any }>;
}

interface State {
  sheets: Record<string, Record<string, ChartData>>;
}

interface Actions {
  updateChart: (tab: string, id: string, data: ChartData) => void;
}

const initialState: State = {
  sheets: {},
};

export default lens<State & Actions>((set) => {
  return {
    ...initialState,

    updateChart: (tab: string, id: string, data: ChartData) => {
      set((draft) => {
        if (!draft.sheets[tab]) return;

        draft.sheets[tab][id] = data;
      });
    },
  };
});
