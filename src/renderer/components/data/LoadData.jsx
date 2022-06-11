/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { emitCustomEvent, useCustomEventListener } from 'react-custom-events';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import store from '../../store/store';

window.bfCore.handleLoadDataResponse((event, data) => {
  emitCustomEvent('BF_CORE.LOAD_DATA_RESPONSE', data);
});

export const LoadData = ({ closeDialog }) => {
  const [fileLog, setFileLog] = useState('Loading data sources... \n');
  const [buffer, setBuffer] = useState({});
  const [doneFiles, setDoneFiles] = useState(0);
  const [filesNum, setFilesNum] = useState(0);

  useCustomEventListener('BF_CORE.LOAD_DATA_RESPONSE', (data) => {
    let text = '';
    if (data.type === 'START_FILE') {
      text = `Loading ${data.payload.file}...`;
    } else if (data.type === 'FILE_FAIL') {
      text = `Cannot load ${data.payload.file}, please check the file integrity. \n Aborting...`;
    } else if (data.type === 'LOADED_FILE') {
      text = `Loaded ${data.payload.file}.`;

      setBuffer((prev) => ({
        ...prev,
        [data.payload.file]: {
          data: data.payload.data,
          columns: data.payload.columns,
        },
      }));

      setDoneFiles((prev) => prev + 1);
    } else if (data.type === 'END') {
      text = `Finished loading data sources.`;

      store.dispatch({
        type: 'BF_CORE_LOAD_DATA',
        tables: buffer,
      });
    }

    setFileLog((prev) => `${prev + text}\n`);
  });

  useEffect(() => {
    const data = store.getState().dataModel;
    window.bfCore.reloadDataSources(data);
    setFilesNum(data.tables.size || 0);
    return () => {};
  }, []);

  // TODO: Create abort functionality
  return (
    <div>
      <DialogTitle>Loading Data</DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress size="5rem" />
          <Typography position="absolute">
            {filesNum === 0 ? 100 : (doneFiles / filesNum) * 100}%
          </Typography>
        </Box>
        <Box
          style={{
            width: '500px',
            overflow: 'auto',
            overflowWrap: ' break-word',
            marginTop: '25px',
            padding: '5px',
            backgroundColor: '#eceff1',
            borderRadius: '4px',
            minHeight: '80px',
            maxHeight: '300px',
          }}
        >
          <Typography style={{ whiteSpace: 'pre-line' }}>{fileLog}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        {doneFiles < filesNum && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => closeDialog()}
          >
            Abort
          </Button>
        )}
        {doneFiles >= filesNum && (
          <Button
            variant="outlined"
            color="success"
            onClick={() => closeDialog()}
          >
            Done
          </Button>
        )}
      </DialogActions>
    </div>
  );
};

export default LoadData;
