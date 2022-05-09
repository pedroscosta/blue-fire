/* eslint-disable react/prop-types */
import React, { memo } from 'react';
import { Handle } from 'react-flow-renderer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Node, { contentStyle as style } from '../Node';

const isValidInput = (connection, type) => {
  return true; //R.last(R.split('__', connection.source)) === type;
};
const isValidOutput = (connection, type) => {
  return true; //R.last(R.split('__', connection.target)) === type;
};

// eslint-disable-next-line react/prop-types
const FunctionNode = ({ data, selected }) => {
  return (
    <Node
      label={data.label}
      selected={selected}
      subheader={data.file}
      content={
        <>
          <List sx={style.list} component="nav" aria-label="mailbox folders">
            {data.rows.map((input, i, { length }) => (
              <>
                <ListItem
                  sx={{ textAlign: 'center' }}
                  style={{ paddingTop: 0, paddingBottom: 0 }}
                >
                  <ListItemText
                    primaryTypographyProps={{ variant: 'caption' }}
                    primary={input}
                  />
                  <Handle
                    type="target"
                    position="left"
                    id={`i-${input}__target}`}
                    style={{ ...style.left }}
                    isValidConnection={(connection) =>
                      isValidInput(connection, input.type)
                    }
                  />
                  <Handle
                    type="source"
                    position="right"
                    id={`i-${input}__source}`}
                    style={{ ...style.right }}
                    isValidConnection={(connection) =>
                      isValidInput(connection, input.type)
                    }
                  />
                </ListItem>
                {length - 1 !== i && <Divider />}
              </>
            ))}
          </List>
          {/* {data.inputs.map((input) => (
            <div
              key={`i-${input.label}`}
              style={{ ...style.io, ...style.textLeft }}
            >
              {input.label}
              <Handle
                type="target"
                position="left"
                id={`i-${input.label}__${input.type}`}
                style={{ ...style.handle, ...style.left }}
                isValidConnection={(connection) =>
                  isValidInput(connection, input.type)
                }
              />
            </div>
          ))} */}
        </>
      }
    />
  );
};

export default memo(FunctionNode);
