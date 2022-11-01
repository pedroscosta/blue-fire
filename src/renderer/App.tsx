import { ChakraProvider } from '@chakra-ui/react';
import * as bluefire from 'bluefire';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import './App.css';
import store from './store/store';
// import AnalyticsTab from './tabs/analytics';
// import DataTab from './tabs/data';

import CustomTitlebar from './components/navigation/CustomTitlebar';
import MovableTabs from './components/navigation/MovableTabs';
import Theme from './Theme';

bluefire.extensions.loadExtensions();

export default function App() {
  return (
    <ChakraProvider theme={Theme}>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <div id="title" style={{ zIndex: 2000, height: 28 }}>
            <CustomTitlebar />
          </div>
          <div
            style={{
              flex: '1 1 100%',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
            id="root"
          >
            <MovableTabs />
            {/* <TabContext value={currentTab}>
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
              </TabPanel>
            </TabContext> */}
          </div>
        </DndProvider>
      </Provider>
    </ChakraProvider>
  );
}
