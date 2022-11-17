const createMenu = () => {
  return [
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          accelerator: 'Ctrl+N',
          click: () => {
            // console.log(store.getState());
          },
        },
        {
          label: 'Open File',
          accelerator: 'Ctrl+O',
          click: async () => {
            // const [fileData, filePath] = await window.bfCore.openFile(); // TODO: Handle errors
            // store.dispatch({
            //   type: 'BF_CORE_LOAD_PROJECT',
            //   fileData,
            //   filePath,
            // });
            // emitCustomEvent('BF_CORE.REFETCH_STORED_DATA'); // Dispatching a custom event to all listening components to avoid any complicated refetch from the store.
          },
        },
        {
          label: 'Save File',
          accelerator: 'Ctrl+S',
          click: () => {
            // window.bfCore.saveFile(store.getState());
          },
        },
        {
          label: 'Save File As...',
          accelerator: 'Ctrl+Shift+S',
          click: async () => {
            // store.dispatch({
            //   type: 'BF_CORE_SET_CUR_PROJ_PATH',
            //   path: await window.bfCore.saveFileAs(store.getState()),
            // });
          },
        },
        {
          type: 'separator',
          click: async () => {},
        },
        {
          label: 'Preferences',
          click: async () => {},
        },
        {
          label: 'Quit Application',
          accelerator: 'Ctrl+Q',
          click: async () => {},
        },
      ],
    },
  ];
};

export default createMenu;
