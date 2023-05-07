import { AlertStatus } from '@chakra-ui/react';
import * as convert from '@uiw/color-convert';
import { nanoid } from 'nanoid';
import { ElementType } from 'react';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/*---------------------------------------------------------------------------------------------
 *
 *  Interfaces and types
 *
 *--------------------------------------------------------------------------------------------*/

export enum ChartComponentType {
  CHART,
  ACCESSORY,
}

export enum DataType {
  NUMBER,
  CATEGORY,
}

export type DataProperty = { name: string; query: string; type: DataType };

export interface ChartData {
  panelData: PanelData;
  baseType: string;
  data: {
    dimensions: DataProperty[];
    measures: DataProperty[];
  };
  components: Record<string, { component: string; props: any; dock: string }>;
}

export type QueriedChartData = {
  dimensions: any[][];
  measures: any[][];
};

// Chart Properties

export interface PanelData {
  x: number;
  y: number;
  w: number;
  h: number;
  hover?: boolean;
}

export enum ComponentPropertyType {
  TEXT,
  BOOLEAN,
  SELECT,
  NUMBER,
  COLOR,
  MULTI_BOOLEAN,
  DATA_SELECTOR,
}

export interface ComponentProperty {
  type: ComponentPropertyType;
  name: string;
  desc: string;
  defaultValue?: any;
  options?: string[];
  inputProps?: Record<string, string | number | boolean>;
}

// Data slice

export interface DataSource {
  location: string;
  columns: string[];
}

export interface DagData {
  [index: string]: { top: number; left: number };
}

export interface LoadedData {
  fields: Record<string, string>;
  tables: Record<string, any>; // TODO: Add a precise type for table object
}

// Store

export type ComponentPropertiesRegister = Record<
  string,
  { title: string; groups: { title: string; properties: Record<string, ComponentProperty> }[] }
>;

// Registry

export interface ComponentRegister {
  component?: ElementType;
  data?: any;
  condition?:
    | ((context: BluefireState['context']) => boolean)
    | {
        key: string;
        value?: string;
      };
}

export interface ChartComponent extends ComponentRegister {
  component: ElementType;
  data: {
    name: string;
    baseType: string;
    type: ChartComponentType;
    startingData?: Partial<ChartData>;
    allowedDocks?: string[];
    validation?: ChartComponentErrorCheck;
    sizeCalculator?: ChartComponentSizeCalculator;
    icon?: ElementType;
  };
}

export interface BluefireState {
  primed: boolean;
  tabs: {
    // State
    tabTypes: Record<string, { name: string; as: ElementType }>;
    fixedTabs: string[];
    openableTabs: string[];
    movableTabs: string[];
    tabs: Record<string, { name: string; type: string }>;
    // Actions
    moveTab: (draggedIndex: number, targetIndex: number) => void;
  };
  data: {
    // State
    dataSources: Record<string, DataSource>;
    dataModel: {
      dag: DagData;
      connections: Record<string, string>;
    };
    loadedState: LoadedData & {
      filters: any[]; // TODO: Add a precise type for filter object
    };
    // Actions
    createDataSource: (name: string, source: DataSource) => void;
    removeDataSource: (name: string) => void;
    setDagData: (data: Record<string, { top: number; left: number }>) => void;
    loadData: (data: LoadedData) => void;
    queryColumn: (col: string) => any[] | undefined;
  };
  context: {
    // State
    state: {
      [index: string]: string;
    };
    // Actions
    set: (key: string, value?: string) => void;
    satisfies: (key: string, condition?: string | ((value: string) => boolean)) => boolean;
  };
  registry: {
    // State
    components: Record<string, Record<string, ComponentRegister>>;
    // Actions
    register: (slot: string, id: string, component: ComponentRegister) => void;
    remove: (slot: string, id: string) => void;
    query: (slot: string, context: BluefireState['context']) => Record<string, ComponentRegister>;
  };
  sheets: {
    // State
    sheets: Record<string, Record<string, ChartData>>;
    // Actions
    updateChart: (
      tab: string,
      id: string,
      data: ChartData | ((past: ChartData) => ChartData),
    ) => void;
    modifyChart: (tab: string, id: string, producer: (draft: ChartData) => void) => void;
    removeChart: (tab: string, id: string) => void;
  };
  chartProps: {
    // State
    state: Record<string, ComponentPropertiesRegister>;
    // Actions
    registerProps: (type: string, props?: ComponentPropertiesRegister) => void;
  };
}

// Chart components props

export type ChartComponentProps = {
  width: number;
  height: number;
  id: string;
  tabId: string;
  compId: string;
  data: QueriedChartData;
  dataProps: ChartData['data'];
  dock: string;
  props: any;
};

// Chart error detection function

export type ChartComponentErrorCheck = (
  data: QueriedChartData,
  props: any,
) =>
  | { title?: string | React.ReactNode; message?: string | React.ReactNode; status?: AlertStatus }
  | undefined;

// Chart components size calculator

export type ChartComponentSizeCalculator = (
  data: QueriedChartData,
  props: any,
  dock: string,
) => number;

// Register Chart Data

export type RegisterChartData = {
  id: string;
  name: string;
  component: ElementType;
  type: ChartComponentType;
  baseType: string;
  icon?: ElementType;
  props?: ComponentPropertiesRegister;
  validation?: ChartComponentErrorCheck;
  allowedDocks?: string[];
  sizeCalculator?: ChartComponentSizeCalculator;
};

const _store = create<BluefireState>()(
  devtools(subscribeWithSelector(immer(() => ({} as BluefireState)))),
); // TODO: Make this type without creating this store (https://github.com/pmndrs/zustand/discussions/1454).

export type BluefireStore = typeof _store;

/*---------------------------------------------------------------------------------------------
 *
 *  Methods
 *
 *--------------------------------------------------------------------------------------------*/

const getState = () => ((window as any).BluefireStore as BluefireStore).getState();

const charts = {
  registerComponent: (data: RegisterChartData) => {
    const { id, component, type, props, ...rest } = data;

    const startingData: Partial<ChartData> | undefined =
      type === ChartComponentType.CHART
        ? {
            components: { [nanoid()]: { component: id, props: {}, dock: 'FULL' } },
          }
        : undefined;

    getState().registry.register('bf:chart-components', id, {
      component,
      data: { ...rest, type, startingData },
    });

    getState().chartProps.registerProps(id, props);
  },
};

const colors = {
  getNamedColor: (col: string, includeVar = false) => {
    const val = `--chakra-colors-${col.replaceAll('.', '-')}`;
    return includeVar ? `var(${val})` : val;
  },
  getCssVar: (col: string) => {
    return window
      .getComputedStyle(document.body)
      .getPropertyValue(col.startsWith('--') ? col : colors.getNamedColor(col));
  },
  safeHsvaToHexa: (col: convert.HsvaColor | string) => {
    return typeof col === 'string' ? col : convert.hsvaToHexa(col);
  },
  ...convert,
};

const getStore: () => Pick<BluefireStore, 'getState' | 'subscribe'> = () => ({
  getState: ((window as any).BluefireStore as BluefireStore).getState,
  subscribe: ((window as any).BluefireStore as BluefireStore).subscribe,
});

export { charts, getStore, colors };
