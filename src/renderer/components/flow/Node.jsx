import React, { memo } from 'react';
import { Card } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

export const contentStyle = {
  list: {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
    padding: 0,
    margin: 0,
  },
  left: { left: '4.5px' },
  right: { right: '4.5px' },
};

const style = {
  body: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    border: '0px solid #bbb',
    fontSize: '10pt',
  },
  selected: {
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
  },
  title: {
    position: 'relative',
    padding: '8px 32px',
    flexGrow: 1,
    backgroundColor: '#eee',
  },
  contentWrapper: {
    padding: '8px 0px',
  },
};

// eslint-disable-next-line react/prop-types
const Node = ({ label, selected, content, subheader }) => {
  const customTitle = { ...style.title };

  // Collapse contentWrapper on icon click
  return (
    // <div style={{ ...style.body, ...(selected ? style.selected : []) }}>
    //   <div style={customTitle}>{label}</div>
    //   <div style={style.contentWrapper}>{content}</div>
    // </div>
    <Card>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon sx={{ fontSize: '0.9rem' }} />
          </IconButton>
        }
        title={label}
        subheader={subheader}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
        titleTypographyProps={{ variant: 'body1' }}
      />
      <CardContent style={{ padding: 0 }}>{content}</CardContent>
    </Card>
  );
};

export default memo(Node);
