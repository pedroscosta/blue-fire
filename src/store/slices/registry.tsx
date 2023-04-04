import { lens } from '@dhmk/zustand-lens';
import { BluefireState, ComponentRegister } from 'bluefire';

export default lens<BluefireState['registry']>((set, get) => {
  return {
    components: {},

    register: (slot: string, id: string, component: ComponentRegister) => {
      set((draft) => {
        if (!draft.components[slot]) draft.components[slot] = {};

        draft.components[slot][id] = component;
      });
    },

    remove: (slot: string, id: string) => {
      set((draft) => {
        if (!draft.components[slot]) return;

        delete draft.components[slot][id];
      });
    },

    query: (slot: string, context: BluefireState['context']) => {
      const components = get().components;

      if (!components[slot]) return {};

      const result: Record<string, ComponentRegister> = {};

      Object.entries(components[slot]).forEach(([k, v]) => {
        if (!v.condition) {
          result[k] = v;
        } else if (typeof v.condition === 'object') {
          if (!v.condition.value && context.state[v.condition.key]) result[k] = v;
          if (context.satisfies(v.condition.key, v.condition.value)) result[k] = v;
        } else {
          if (v.condition(context)) result[k] = v;
        }
      });

      return result;
    },
  };
});
