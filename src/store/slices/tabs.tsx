import DataTab from '@/tabs/data';
import { lens } from '@dhmk/zustand-lens';
import { nanoid } from 'nanoid';
import { ElementType } from 'react';

interface State {
  tabTypes: {
    [index: string]: { name: string; as: ElementType };
  };
  fixedTabs: string[];
  openableTabs: string[];
  movableTabs: string[];
  tabs: {
    [index: string]: { name: string; type: string };
  };
}

const nid = nanoid();
const nid2 = nanoid();

const SheetTab = ({ id }: { id: string }) => <h1>{id}</h1>;

const initialState: State = {
  tabTypes: {
    'bf:data-tab': { name: 'Data', as: DataTab as ElementType },
    'bf:sheet-tab': { name: 'Sheet', as: SheetTab as ElementType },
  },
  fixedTabs: ['bf:data-tab'],
  openableTabs: ['bf:sheet-tab'],
  movableTabs: [nid, nid2],
  tabs: {
    'bf:data-tab': { name: 'Data', type: 'bf:data-tab' },
    [nid]: { name: 'Sheet 1', type: 'bf:sheet-tab' },
    [nid2]: { name: 'Sheet 2', type: 'bf:sheet-tab' },
  },
};

interface Actions {
  moveTab: (draggedIndex: number, targetIndex: number) => void;
}

export default lens<State & Actions>((set) => {
  return {
    ...initialState,

    moveTab: (draggedIndex: number, targetIndex: number) => {
      set((draft) => {
        const dragged = draft.movableTabs[draggedIndex];
        draft.movableTabs.splice(draggedIndex, 1);
        draft.movableTabs.splice(targetIndex, 0, dragged);
      });
    },
  };
});
