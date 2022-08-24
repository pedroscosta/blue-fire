/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ListItemText from '@mui/material/ListItemText';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Tooltip from '@mui/material/Tooltip';

import DraggableItem from './DraggableItem';

const viewWidth = 320;

// const closedMixin = (theme) => ({
//   overflowX: 'hidden',
//   width: `calc(${theme.spacing(7)} + 1px)`,
//   [theme.breakpoints.up('sm')]: {
//     width: `calc(${theme.spacing(8)} + 1px)`,
//   },
// });

// const Drawer = styled(MuiDrawer, {
//   shouldForwardProp: (prop) => prop !== 'open',
// })(({ theme, open }) => ({
//   width: drawerWidth,
//   flexShrink: 0,
//   whiteSpace: 'nowrap',
//   boxSizing: 'border-box',
//   ...closedMixin(theme),
//   '& .MuiDrawer-paper': closedMixin(theme),
// }));

const Drawer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
}));

const View = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  overflowX: 'hidden',
  width: theme.spacing(30),
  [theme.breakpoints.up('lg')]: {
    width: theme.spacing(40),
  },
}));

const SidebarIconButton = ({ icon, text, onClick }) => (
  <Tooltip title={text} placement="right">
    <ListItem key={text} disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: 'center',
          px: 2.5,
        }}
        onClick={() => {
          onClick(text);
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: 'auto',
            justifyContent: 'center',
          }}
        >
          {icon}
        </ListItemIcon>
      </ListItemButton>
    </ListItem>
  </Tooltip>
);

const Sidebar = () => {
  const [viewOpen, setViewOpen] = useState(false);
  const [currentView, setCurrentView] = useState(false);

  const sidebarViews = {
    'New Chart': <>Charts</>,
  };

  const onViewIconClick = (text) => {
    if (viewOpen && currentView === text) {
      setViewOpen(false);
    } else {
      setViewOpen(true);
      setCurrentView(text);
    }
  };

  return (
    <>
      {viewOpen && (
        <View sx={{ borderLeft: '1px solid', borderColor: 'divider' }}>
          <List style={{ width: '100%' }}>
            <DraggableItem
              content={
                <ListItem
                  sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                >
                  <ListItemIcon>
                    <DragIndicatorIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Scatter Plot"
                    secondary="Plots points with X and Y dimensions"
                  />
                </ListItem>
              }
              type="CHART"
            />
          </List>
        </View>
      )}
      <Drawer sx={{ borderLeft: '1px solid', borderColor: 'divider' }}>
        <List>
          <SidebarIconButton
            text="New Chart"
            icon={<AddBoxIcon />}
            onClick={onViewIconClick}
          />
        </List>
        <Divider />
      </Drawer>
    </>
  );
};

export default Sidebar;
