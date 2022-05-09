import React from 'react';
import './App.css';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CustomTitlebar from './components/navigation/CustomTitlebar';
import icon from '../../assets/icon.svg';
import DataTab from './tabs/data';
import AnalyticsTab from './tabs/analytics';

export default function App() {
  const [currentTab, setCurrentTab] = React.useState('data');

  return (
    <div
      style={{
        flex: '1 1 100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomTitlebar />
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
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          <DataTab />
        </TabPanel>
        <TabPanel value="analytics">
          <AnalyticsTab />
        </TabPanel>
      </TabContext>
    </div>
  );
}
