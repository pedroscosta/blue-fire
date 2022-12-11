import { lens } from '@dhmk/zustand-lens';
import Context from './context';

import useDataLoading from '@/hooks/logic/useDataLoading';
import { useStore } from '@/store';
import { Button } from '@chakra-ui/react';
import { ElementType } from 'react';
import shallow from 'zustand/shallow';

interface ComponentRegister {
  component: ElementType;
  condition:
    | ((context: typeof Context) => boolean)
    | {
        key: string;
        value: string;
      };
}

interface State {
  components: {
    [index: string]: { [index: string]: ComponentRegister };
  };
}

interface Actions {
  register: (slot: string, id: string, component: ComponentRegister) => void;
  remove: (slot: string, id: string) => void;
  query: (
    slot: string,
    context: typeof Context,
  ) => {
    [index: string]: ElementType;
  };
}

const initialState: State = {
  components: {
    'bf:tabs-actions': {
      'bf:load-data-action': {
        condition: {
          key: 'bf:current-tab-type',
          value: 'bf:data-tab',
        },
        component: () => {
          const { dataSources, loadData } = useStore((s) => s.data, shallow);

          const dataLoader = useDataLoading();

          return (
            <Button
              colorScheme="green"
              variant="outline"
              size="sm"
              onClick={() => {
                dataLoader.load(dataSources, (data) => loadData(data));
              }}
            >
              Load data
            </Button>
          );
        },
      },
    },
  },
};

export default lens<State & Actions>((set, get) => {
  return {
    ...initialState,

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

    query: (slot: string, context: typeof Context) => {
      const components = get().components;

      if (!components[slot]) return {};

      const result: { [index: string]: ElementType } = {};

      Object.entries(components[slot]).forEach(([k, v]) => {
        if (typeof v.condition === 'object') {
          if (context.satisfies(v.condition.key, v.condition.value)) result[k] = v.component;
        } else {
          if (v.condition(context)) result[k] = v.component;
        }
      });

      return result;
    },
  };
});
