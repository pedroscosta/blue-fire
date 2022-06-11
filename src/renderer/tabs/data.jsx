/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { ReactFlowProvider } from 'react-flow-renderer';
import { DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import DataFlow from '../components/panels/DataFlowPanel';
import NewSourceButton from '../components/data/NewSourceButton';
import { getFileFromPath } from '../utils/string';
import { useDialog } from '../components/providers/DialogProviders';
import { LoadData } from '../components/data/LoadData';

const saveDataModel = (connections) => {
  return {
    type: 'BF_CORE_SAVE_DATA_MODEL',
    connections,
  };
};

const addDataSource = (table, file, columns) => {
  return {
    type: 'BF_CORE_ADD_DATA_SOURCE',
    table,
    file,
    columns,
  };
};

const storeFlowState = (flowState) => {
  return {
    type: 'BF_CORE_STORE_FLOW_STATE',
    nodes: flowState.nodes,
    edges: flowState.edges,
  };
};

const getDataModel = (edges) => {
  saveDataModel(
    edges.map((edge) => {
      return `${edge.source.slice(0, -5)}>${edge.target.slice(0, -5)}`;
    })
  );
};

const DataTab = ({ storedFlowState, dispatch }) => {
  const [flowState, setFlowState] = React.useState(storedFlowState);
  const [openDialog, closeDialog] = useDialog();

  const dataFlow = useRef();

  const handleTableLoad = (tableName, data, file) => {
    dispatch(addDataSource(tableName, file, data.columns));

    dataFlow.current.createNodeFromData(
      tableName,
      data.columns,
      getFileFromPath(file)
    );
  };

  const handleFlowChange = (nodes, edges) => {
    setFlowState({ nodes, edges });
    dispatch(storeFlowState({ nodes, edges }));
  };

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

        <NewSourceButton handleTableLoad={handleTableLoad} />

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="outlined"
          color="success"
          onClick={() => {
            openDialog({
              children: <LoadData closeDialog={closeDialog} />,
            });
          }}
        >
          Load data
        </Button>
      </Toolbar>
      <div
        style={{
          flex: '1 1 auto',
        }}
      >
        <ReactFlowProvider>
          <DataFlow
            ref={dataFlow}
            initialState={storedFlowState}
            onChange={handleFlowChange}
          />
        </ReactFlowProvider>
      </div>
    </>
  );
};

export default connect((state) => ({
  storedFlowState: state.flowState,
}))(DataTab);
