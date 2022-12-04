import { withLenses } from '@dhmk/zustand-lens';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import context from './slices/context';
import data from './slices/data';
import registry from './slices/registry';
import tabs from './slices/tabs';

export const useStore = create(
  devtools(
    immer(
      withLenses({
        tabs: tabs,
        data: data,
        context: context,
        registry: registry,
      }),
    ),
  ),
);
