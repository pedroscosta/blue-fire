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
import VirtualizedDataTable from '../table/VirtualizedDataTable';

const steps = ['Load your data', 'Select fields'];

const NewSourceButton = () => {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [curFile, setCurFile] = React.useState(null);
  const [previewData, setPreviewData] = React.useState(null);
  const [selectedRows, setSelectedRows] = React.useState(null);

  // File loader

  const handleFile = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    /* data is an ArrayBuffer */
    const workbook = XLSX.read(arrayBuffer, { sheetRows: 20 });

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const dataArray = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
    });

    // const cols = dataArray[0];
    // const headers = cols.map((head) => ({ name: head, label: head }));
    const headers = dataArray[0];

    const data = dataArray.slice(1).map((r) =>
      r.reduce((acc, x, i) => {
        acc[dataArray[0][i]] = x;
        return acc;
      }, {})
    );

    setPreviewData({ headers, data });
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
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%' }}>
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
            <Box sx={{ pt: 3 }}>
              {activeStep === 0 ? (
                <>
                  <DropzoneAreaBase
                    onAdd={(fileObjs) => {
                      setCurFile(fileObjs);
                      handleFile(fileObjs[0].file);
                    }}
                    showAlerts={false}
                  />
                </>
              ) : (
                <>
                  <Paper style={{ height: 400, width: '100%' }}>
                    <VirtualizedDataTable
                      data={previewData}
                      handleRowSelect={(sr) => setSelectedRows(setSelectedRows)}
                      selectableRows
                    />
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

                <Button onClick={handleNext}>
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
