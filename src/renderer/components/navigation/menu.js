/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/prefer-default-export */
import { emitCustomEvent } from 'react-custom-events';
import { useEffect, useState } from 'react';
import store from '../../store/store';

const doClick = (queueSnack) => (item, currentWindow, e) => {
  // let label = `Item Clicked: ${item.label}!`;
  // let variant = 'info';
  // if (item.type === 'radio') {
  //   label = `Radio Selected: ${item.label}!`;
  //   variant = 'success';
  // } else if (item.type === 'checkbox') {
  //   label = `${item.checked ? 'Checked' : 'Unchecked'} Item: ${item.label}!`;
  //   variant = item.checked ? 'success' : 'error';
  // }
  // queueSnack(label, { variant });
  console.log(store.getState());
};

const createMenu = (storeState) => {
  const click = doClick();
  return [
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          accelerator: 'Ctrl+N',
          click: () => {
            console.log(store.getState());
          },
        },
        {
          label: 'Open File',
          accelerator: 'Ctrl+O',
          click: async () => {
            const [fileData, filePath] = await window.bfCore.openFile(); // TODO: Handle errors

            store.dispatch({
              type: 'BF_CORE_LOAD_PROJECT',
              fileData,
              filePath,
            });

            emitCustomEvent('BF_CORE.REFETCH_STORED_DATA'); // Dispatching a custom event to all listening components to avoid any complicated refetch from the store.
          },
        },
        {
          label: 'Save File',
          accelerator: 'Ctrl+S',
          click: () => {
            window.bfCore.saveFile(store.getState());
          },
        },
        {
          label: 'Save File As...',
          accelerator: 'Ctrl+Shift+S',
          click: async () => {
            store.dispatch({
              type: 'BF_CORE_SET_CUR_PROJ_PATH',
              path: await window.bfCore.saveFileAs(store.getState()),
            });
          },
        },
        {
          type: 'separator',
          click,
        },
        {
          label: 'Preferences',
          click,
        },
        {
          label: 'Quit Application',
          accelerator: 'Ctrl+Q',
          click,
        },
      ],
    },
  ];
};

export const useMenu = (storeState) => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    return setMenu(createMenu(storeState));
  }, []);

  return menu;
};
