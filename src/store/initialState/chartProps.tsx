import { BluefireState, ComponentPropertyType } from 'bluefire';

const initialState: Partial<BluefireState['chartProps']> = {
  state: {
    'bf:base-chart': {
      general: {
        title: 'General',
        groups: [
          {
            title: 'Information',
            properties: {
              'chart-title': {
                name: 'Title',
                desc: 'Chart title (leave empty for no title)',
                type: ComponentPropertyType.TEXT,
              },
              'chart-subtitle': {
                name: 'Subtitle',
                desc: 'Chart subtitle (leave empty for no subtitle)',
                type: ComponentPropertyType.TEXT,
              },
            },
          },
        ],
      },
    },
  },
};

export default initialState;
