import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import { StylesProvider } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DataTab from './tabs/data';
import AnalyticsTab from './tabs/analytics';
import store from './store/store';

import CustomTitlebar from './components/navigation/CustomTitlebar';
import DialogProvider from './components/providers/DialogProviders';

export default function App() {
  const [currentTab, setCurrentTab] = React.useState('data');

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
