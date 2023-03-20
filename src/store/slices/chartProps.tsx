import { lens } from '@dhmk/zustand-lens';
import { ComponentPropertiesRegister, ComponentPropertyType } from 'bluefire';

interface State {
  state: Record<string, ComponentPropertiesRegister>;
}

interface Actions {
  registerProps: (type: string, props: ComponentPropertiesRegister) => void;
}

const initialState: State = {
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

export default lens<State & Actions>((set) => {
  return {
    ...initialState,

    registerProps: (type: string, props: ComponentPropertiesRegister) => {
      set((draft) => {
        draft.state[type] = props;
      });
    },
  };
});
