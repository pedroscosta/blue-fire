import { nanoid } from 'nanoid';
import { ElementType } from 'react';
import type { Mutate, StoreApi, UseBoundStore } from 'zustand';
import { devtools } from 'zustand/middleware';
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

export interface ChartData {
  panelData: PanelData;
  baseType: string;
  series: Record<string, { col: string; type: DataType }>;
  components: Record<string, { component: string; props: any }>;
}

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
  OPTIONS,
  NUMBER,
  COLOR,
  MULTI_BOOLEAN,
  DATA_SELECTOR,
}

export interface ComponentProperty {
  type: ComponentPropertyType;
  options?: string[];
  defaultValue?: any;
  name: string;
  desc: string;
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
    startingData: Partial<ChartData>;
    type: ChartComponentType;
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
    removeChart: (tab: string, id: string) => void;
  };
  chartProps: {
    // State
    state: Record<string, ComponentPropertiesRegister>;
    // Actions
    registerProps: (type: string, props?: ComponentPropertiesRegister) => void;
  };
}

// This is to keep the imports from being removed.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Immer = typeof immer;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Devtools = typeof devtools;

export type BluefireStore = UseBoundStore<
  Mutate<StoreApi<BluefireState>, [['zustand/immer', never], ['zustand/devtools', never]]>
>;

/*---------------------------------------------------------------------------------------------
 *
 *  Methods
 *
 *--------------------------------------------------------------------------------------------*/

const getState = () => ((window as any).BluefireStore as BluefireStore).getState();

const charts = {
  registerBaseType: (id: string, name: string, component: ElementType) => {
    getState().registry.register('bf:chart-types', id, {
      component,
      data: { name },
    });
  },

  registerComponent: (
    id: string,
    name: string,
    component: ElementType,
    type: ChartComponentType,
    baseType: string,
    icon?: ElementType,
    props?: ComponentPropertiesRegister,
  ) => {
    const startingData: Partial<ChartData> = {
      components: { [nanoid()]: { component: id, props: {} } },
    };

    getState().registry.register('bf:chart-components', id, {
      component,
      data: { name, type, icon, startingData },
    });

    getState().chartProps.registerProps(id, props);
  },
};

const store: BluefireStore = (window as any).BluefireStore;

export { charts, store };
