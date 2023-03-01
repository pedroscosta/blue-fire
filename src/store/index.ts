import { withLenses } from '@dhmk/zustand-lens';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import context from './slices/context';
import data from './slices/data';
import registry from './slices/registry';
import sheets from './slices/sheets';
import tabs from './slices/tabs';

import create_ from 'zustand/vanilla';

const store = create_(
  devtools(
    immer(
      withLenses({
        tabs: tabs,
        data: data,
        context: context,
        registry: registry,
        sheets: sheets,
      }),
    ),
  ),
);

export type BlueFireStore = typeof store;

export const { getState, setState, subscribe, destroy } = store;

export const useStore = create(store);
