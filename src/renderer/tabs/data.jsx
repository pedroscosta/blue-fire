import React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import DataFlow from '../components/panels/DataFlowPanel';
import NewSourceButton from '../components/data/NewSourceButton';

export default function DataTab() {
  return (
    <>
      <Toolbar variant="dense" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <NewSourceButton />

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="success">
          Load data
        </Button>
      </Toolbar>
      <div
        style={{
          flex: '1 1 auto',
        }}
      >
        <DataFlow />
      </div>
    </>
  );
}
