import ChartsPropertiesView from '@/components/navigation/CollapsibleSidebar/views/ChartPropertiesView';
import ChartsView from '@/components/navigation/CollapsibleSidebar/views/ChartsView';
import ComponentsView from '@/components/navigation/CollapsibleSidebar/views/ComponentsView';
import useDataLoading from '@/hooks/logic/useDataLoading';
import { Button } from '@chakra-ui/react';
import { BluefireState } from 'bluefire';
import { MdAddChart, MdOutlineEditNote, MdOutlineLibraryAdd } from 'react-icons/md';
import shallow from 'zustand/shallow';
import { useStore } from '..';

const initialState: Partial<BluefireState['registry']> = {
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
      'bf:components-view': {
        component: ComponentsView,
        data: {
          icon: MdOutlineLibraryAdd,
          title: 'Components',
        },
      },
      'bf:chart-properties-view': {
        component: ChartsPropertiesView,
        condition: (ctx) =>
          ctx.state['bf:selected-chart-id'] != undefined &&
          ctx.state['bf:current-tab-id'] === ctx.state['bf:selected-chart-tab'],
        data: {
          icon: MdOutlineEditNote,
          title: 'Properties',
        },
      },
    },
  },
};

export default initialState;
