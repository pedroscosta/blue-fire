import { ElementType } from 'react';

declare module 'bluefire' {
  export namespace charts {
    export function registerBaseType(id: string, name: string, component: ElementType): void;

    export function registerComponent(
      id: string,
      name: string,
      component: ElementType,
      type: ChartComponentType,
      baseType: string,
      icon?: ElementType,
    ): void;
  }
}

export enum ChartComponentType {
  CHART = 'CHART',
  ACCESSORY = 'ACCESSORY',
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

export interface ChartComponent extends ComponentRegister {
  component: ElementType;
  data: {
    name: string;
    startingData: Partial<ChartData>;
    type: ChartComponentType;
    icon?: ElementType;
  };
}

export interface ComponentRegister {
  component: ElementType | undefined;
  data?: any;
  condition?:
    | ((context: typeof Context) => boolean)
    | {
        key: string;
        value: string;
      };
}
