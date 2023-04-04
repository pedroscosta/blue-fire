import DataTab from '@/tabs/data';
import SheetTab from '@/tabs/sheet';
import { BluefireState } from 'bluefire';
import { nanoid } from 'nanoid';
import { ElementType } from 'react';

const nid = nanoid();
const nid2 = nanoid();

const initialState: Partial<BluefireState['tabs']> = {
  tabTypes: {
    'bf:data-tab': { name: 'Data', as: DataTab as ElementType },
    'bf:sheet-tab': { name: 'Sheet', as: SheetTab as ElementType },
  },
  fixedTabs: ['bf:data-tab'],
  openableTabs: ['bf:sheet-tab'],
  movableTabs: [nid, nid2],
  tabs: {
    'bf:data-tab': { name: 'Data', type: 'bf:data-tab' },
    [nid]: { name: 'Sheet 1', type: 'bf:sheet-tab' },
    [nid2]: { name: 'Sheet 2', type: 'bf:sheet-tab' },
  },
};

export default initialState;
