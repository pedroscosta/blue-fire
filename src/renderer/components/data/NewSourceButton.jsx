/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';

import * as XLSX from 'xlsx';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import MUIDataTable from 'mui-datatables';
import { Paper } from '@mui/material';
import { stripFileExtension } from '../../utils/string';
import VirtualizedDataTable from '../table/VirtualizedDataTable';
import EditableTextField from '../general/EditableTextField';
import './DropZone.css';

const steps = ['Load your data', 'Select fields'];

const NewSourceButton = ({ handleTableLoad }) => {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [curFile, setCurFile] = React.useState(null);
  const [tableName, setTableName] = React.useState(null);
  const [previewData, setPreviewData] = React.useState(null);
  const [selectedCols, setSelectedCols] = React.useState(null);

  // File loader

  const handleFile = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    /* data is an ArrayBuffer */
    const workbook = XLSX.read(arrayBuffer);

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const dataArray = XLSX.utils
      .sheet_to_json(worksheet, {
        header: 1,
      })
      .filter((row) => row.length > 0);

    // const cols = dataArray[0];
    // const headers = cols.map((head) => ({ name: head, label: head }));
    const columns = dataArray[0];

    const data = dataArray.slice(1).map((r) =>
      r.reduce((acc, x, i) => {
        acc[dataArray[0][i]] = x;
        return acc;
      }, {})
    );

    setSelectedCols(columns);
    setPreviewData({ columns, data });
    handleNext();
  };

  // Dialog controls

  const handleClickOpen = () => {
    setOpen(true);
    setActiveStep(0);
  };

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
  };

  // Stepper controls

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      const data = {
        columns: selectedCols,
        data: previewData.data.map((row) =>
          Object.keys(row)
            .filter((key) => selectedCols.includes(key))
            .reduce((obj, key) => {
              obj[key] = row[key];
              return obj;
            }, {})
        ),
      };

      handleTableLoad(tableName, data, curFile);
      handleClose();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div>
      <MenuItem onClick={handleClickOpen}>
        <Typography textAlign="center">New source</Typography>
      </MenuItem>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xll">
        <DialogTitle sx={{ m: 0, p: 2, textAlign: 'center' }}>
          <b>New data source</b>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ height: '70vh', display: 'flex' }}>
          <Box
            sx={{
              width: '100%',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <Box
              sx={{
                pt: 3,
                display: 'flex',
                flexDirection: 'column',
                flex: '1 1 auto',
              }}
            >
              {activeStep === 0 ? (
                <DropzoneAreaBase
                  onAdd={(fileObjs) => {
                    setCurFile(fileObjs[0].file.path);
                    setTableName(stripFileExtension(fileObjs[0].file.name));
                    handleFile(fileObjs[0].file);
                  }}
                  showAlerts={false}
                />
              ) : (
                <>
                  <Paper
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                    }}
                  >
                    <EditableTextField
                      startValue={tableName}
                      fieldStyle={{ padding: 10, marginLeft: '25px' }}
                      onChange={(value) => setTableName(value)}
                      fontSize="25px"
                    />
                    <div style={{ flex: 1 }}>
                      <VirtualizedDataTable
                        data={previewData}
                        selectableRows
                        onColumnSelect={(cols) => setSelectedCols(cols)}
                        orderBy="col1"
                        sortable
                      />
                    </div>
                  </Paper>
                </>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />

                <Button onClick={handleNext} disabled={activeStep === 0}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewSourceButton;
