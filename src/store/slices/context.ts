import { lens } from '@dhmk/zustand-lens';
import { BluefireState } from 'bluefire';

export default lens<BluefireState['context']>((set, get) => {
  return {
    state: {},

    set: (key: string, value?: string) => {
      set((draft) => {
        if (!value && draft.state[key]) delete draft.state[key];

        if (value) draft.state[key] = value;
      });
    },

    satisfies: (key: string, condition?: string | ((value: string) => boolean)) => {
      const value = get().state[key];

      if (!value) return false;

      if (!condition) return true;

      return typeof condition === 'string' ? value === condition : condition(value);
    },
  };
});
