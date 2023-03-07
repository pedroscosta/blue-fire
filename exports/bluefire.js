import { nanoid } from 'nanoid';

const charts = {
  registerBaseType: (id, name, component) => {
    window.BluefireStore.getState().registry.register('bf:chart-types', id, {
      component,
      data: { name },
    });
  },

  registerComponent: (id, name, component, type, baseType, icon) => {
    window.BluefireStore.getState().registry.register('bf:chart-components', id, {
      component,
      data: { name, type, startingData: { components: { [nanoid()]: id } }, icon },
    });
  },
};

const ChartComponentType = {
  CHARTS: 'CHARTS',
  ACCESSORY: 'ACCESSORY',
};

export { charts, ChartComponentType };
