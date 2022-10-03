/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import { StylesProvider } from '@material-ui/core/styles';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import './App.css';
import store from './store/store';
import AnalyticsTab from './tabs/analytics';
import DataTab from './tabs/data';

import CustomTitlebar from './components/navigation/CustomTitlebar';
import DialogProvider from './components/providers/DialogProviders';

export default function App() {
  const [currentTab, setCurrentTab] = React.useState('data');

  // eslint-disable-next-line promise/catch-or-return, promise/always-return

  // .then((files) => {
  //   files.forEach((file: string) => {
  //     // eslint-disable-next-line promise/catch-or-return, promise/no-nesting, promise/always-return
  //     import(`../modules/${file}`).then((obj) => {
  //       console.log(obj);
  //     });
  //   });
  // });

  useEffect(() => {
    const modulesFolder = '../modules';
    const fetchModules = async () => {
      const modulesNames = await bfCore.loadModules(modulesFolder);

      // const loadModules = (files: string[]) =>
      //   Promise.all(files.map((file) => import(`${modulesFolder}/${file}`)));

      // loadModules(modules)
      //   .then((files) => console.log(files))
      //   .catch(console.error);

      // const modules: {
      //   [index: string]: any;
      // } = {};
      console.log(modulesNames);
      modulesNames.forEach(async (file: string) => {
        // const filePath = `${modulesFolder}/${file}`;
        // const obj = await import(`${modulesFolder}/${module}`);
        console.log(require(file.split('\\').join('/')));
        // modules[module] = obj;
      });
    };

    fetchModules();
  }, []);

  return (
    <StylesProvider injectFirst>
      <Provider store={store}>
        <div id="title" style={{ zIndex: 2000, height: 28 }}>
          <CustomTitlebar />
        </div>
        <DialogProvider>
          <div
            style={{
              flex: '1 1 100%',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
            id="root"
          >
            <TabContext value={currentTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={(_event, newValue) => {
                    setCurrentTab(newValue);
                  }}
                  centered
                >
                  <Tab label="Data" value="data" style={{ padding: 0 }} />
                  <Tab label="Analytics" value="analytics" />
                </TabList>
              </Box>
              <TabPanel
                value="data"
                style={{
                  padding: 0,
                  display: 'flex',
                  flex: '1 1 auto',
                  flexDirection: 'column',
                  overflowY: 'auto',
                }}
              >
                <DataTab />
              </TabPanel>
              <TabPanel
                value="analytics"
                style={{
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'row',
                  flex: '1 1 auto',
                  overflowY: 'auto',
                }}
              >
                <AnalyticsTab />
              </TabPanel>
            </TabContext>
          </div>
        </DialogProvider>
      </Provider>
    </StylesProvider>
  );
}
