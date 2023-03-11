import { lens } from '@dhmk/zustand-lens';
import Context from './context';

import ChartsPropertiesView from '@/components/navigation/CollapsibleSidebar/views/ChartPropertiesView';
import ChartsView from '@/components/navigation/CollapsibleSidebar/views/ChartsView';
import useDataLoading from '@/hooks/logic/useDataLoading';
import { useStore } from '@/store';
import { Button } from '@chakra-ui/react';
import { ChartComponentType, ChartData } from 'bluefire';
import { ElementType } from 'react';
import { MdAddChart, MdOutlineEditNote } from 'react-icons/md';
import shallow from 'zustand/shallow';

interface ComponentRegister {
  component?: ElementType;
  data?: any;
  condition?:
    | ((context: typeof Context) => boolean)
    | {
        key: string;
        value?: string;
      };
}

export interface ChartComponent extends ComponentRegister {
  component: ElementType;
  data: {
    name: string;
    startingData: Partial<ChartData>;
    type: ChartComponentType;
    icon?: ElementType;
  };
}

interface State {
  components: Record<string, Record<string, ComponentRegister>>;
}

interface Actions {
  register: (slot: string, id: string, component: ComponentRegister) => void;
  remove: (slot: string, id: string) => void;
  query: (slot: string, context: typeof Context) => Record<string, ComponentRegister>;
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
    'bf:sheet-editor-sidebar': {
      'bf:charts-view': {
        component: ChartsView,
        data: {
          icon: MdAddChart,
          title: 'Charts',
        },
      },
      'bf:chart-properties-view': {
        component: ChartsPropertiesView,
        condition: {
          key: 'bf:selected-chart',
        },
        data: {
          icon: MdOutlineEditNote,
          title: 'Properties',
        },
      },
    },
    // 'bf:chart-types': {
    //   'bf:xy-chart': {
    //     component: XYChart,
    //     data: {
    //       icon: MdAddChart,
    //       name: 'Charts',
    //     },
    //   },
    // },
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
