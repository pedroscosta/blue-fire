/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';

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
  console.log(item);
};

const createMenu = (store) => {
  const click = doClick();
  return [
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          accelerator: 'Ctrl+N',
          click,
        },
        {
          label: 'Open File',
          accelerator: 'Ctrl+O',
          click,
        },
        {
          label: 'Save File',
          accelerator: 'Ctrl+S',
          click,
        },
        {
          label: 'Save File As...',
          accelerator: 'Ctrl+Alt+S',
          click: () => {
            window.bfCore.saveFileAs(store);
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

export const useMenu = (store) => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    return setMenu(createMenu(store));
  }, []);

  return menu;
};
