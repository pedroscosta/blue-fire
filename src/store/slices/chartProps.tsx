import { lens } from '@dhmk/zustand-lens';
import { BluefireState, ComponentPropertiesRegister } from 'bluefire';

export default lens<BluefireState['chartProps']>((set) => {
  return {
    state: {},

    registerProps: (type: string, props?: ComponentPropertiesRegister) => {
      set((draft) => {
        if (!props) return;

        draft.state[type] = props;
      });
    },
  };
});
