import { nanoid } from 'nanoid';
import { ElementType } from 'react';

const getState = () => (window as any).BluefireStore.getState();

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

export { charts };

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

export type ComponentPropertiesRegister = Record<
  string,
  { title: string; groups: { title: string; properties: Record<string, ComponentProperty> }[] }
>;
