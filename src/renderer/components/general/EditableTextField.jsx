/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: 300,
    color: 'black',
    opacity: 1,
    borderBottom: 0,
    '&.Mui-focused': {
      borderBottom: '2px solid rgba(224, 224, 224, 1)',
    },
  },
  disabled: {
    color: 'black',
    borderBottom: 0,
    '&:before': {
      borderBottom: 0,
    },
  },
  btnIcons: {
    marginLeft: 10,
  },
}));

function EditableTextField({ startValue, fieldStyle, fontSize, onChange }) {
  const [value, setValue] = React.useState(startValue);
  const [hovered, setHovered] = React.useState(false);
  const [isNameFocused, setIsNamedFocused] = React.useState(false);

  const classes = useStyles();

  // ((note)) ref doesn't work as TextField doesn't exist when running Typography's onClick
  // console.log({ isNameFocused });

  // ((todo)) create EditableField component
  // ((todo)) put cursor where user clicks rather than at the end
  return (
    <div
      className={classes.container}
      style={{ ...fieldStyle }}
      onMouseEnter={() => !hovered && setHovered(true)}
      onMouseLeave={() => hovered && setHovered(false)}
      onClick={() => !isNameFocused && setIsNamedFocused(true)}
    >
      <TextField
        style={{ fontSize }}
        disabled={!isNameFocused}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          if (onChange) {
            onChange(event.target.value);
          }
        }}
        onBlur={() => setIsNamedFocused(false)}
        InputProps={{
          className: classes.textField,
          classes: {
            disabled: classes.disabled,
          },
          endAdornment: hovered ? (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  setIsNamedFocused(true);
                  setHovered(false);
                }}
              >
                <Edit />
              </IconButton>
            </InputAdornment>
          ) : (
            ''
          ),
          disableUnderline: true,
        }}
      />
    </div>
  );
}

export default EditableTextField;
