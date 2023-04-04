import { lens } from '@dhmk/zustand-lens';
import { BluefireState } from 'bluefire';

export default lens<BluefireState['tabs']>((set) => {
  return {
    tabTypes: {},
    fixedTabs: [],
    openableTabs: [],
    movableTabs: [],
    tabs: {},

    moveTab: (draggedIndex: number, targetIndex: number) => {
      set((draft) => {
        const dragged = draft.movableTabs[draggedIndex];
        draft.movableTabs.splice(draggedIndex, 1);
        draft.movableTabs.splice(targetIndex, 0, dragged);
      });
    },
  };
});
