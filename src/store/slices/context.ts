import { lens } from '@dhmk/zustand-lens';

interface State {
  state: {
    [index: string]: string;
  };
}

interface Actions {
  set: (key: string, value?: string) => void;
  satisfies: (key: string, condition?: string | ((value: string) => boolean)) => boolean;
}

const initialState: State = { state: {} };

export default lens<State & Actions>((set, get) => {
  return {
    ...initialState,

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
