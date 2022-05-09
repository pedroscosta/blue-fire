/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles, styled } from '@mui/styles';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';
import grey from '@material-ui/core/colors/grey';
import Checkbox from '@mui/material/Checkbox';

const classes = {
  flexContainer: 'ReactVirtualizedDemo-flexContainer',
  tableRow: 'ReactVirtualizedDemo-tableRow',
  tableRowHover: 'ReactVirtualizedDemo-tableRowHover',
  tableCell: 'ReactVirtualizedDemo-tableCell',
  noClick: 'ReactVirtualizedDemo-noClick',
};

const styles = ({ theme }) => ({
  // temporary right-to-left patch, waiting for
  // https://github.com/bvaughn/react-virtualized/issues/454
  '& .ReactVirtualized__Table__headerRow': {
    ...(theme.direction === 'rtl' && {
      paddingLeft: '0 !important',
    }),
    ...(theme.direction !== 'rtl' && {
      paddingRight: undefined,
    }),
  },
  [`& .${classes.flexContainer}`]: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  [`& .${classes.tableRow}`]: {
    cursor: 'pointer',
  },
  [`& .${classes.tableRowHover}`]: {
    '&:hover': {
      backgroundColor: grey[200],
    },
  },
  [`& .${classes.tableCell}`]: {
    flex: 1,
  },
  [`& .${classes.noClick}`]: {
    cursor: 'initial',
  },
});

class VirtualizedDataTable extends React.PureComponent {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };

  constructor(props) {
    super(props);
    this.state = {
      rows: props.data.data,
      headers: props.data.headers,
      selectedCols: props.data.headers,
    };
  }

  getRowClassName = ({ index }) => {
    const { onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer = ({ cellData, columnIndex }) => {
    const { columns, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align="right"
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ dataKey, isSelected, columnIndex }) => {
    const { headerHeight, columns } = this.props;
    const { selectedCols } = this.state;

    return (
      <TableCell
        component="div"
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick
        )}
        variant="head"
        style={{ height: headerHeight }}
        align="left"
      >
        <Checkbox
          color="primary"
          checked={isSelected}
          onChange={(event) =>
            this.setState((state, props) => ({
              ...state,
              selectedCols: event.target.checked
                ? [...state.selectedCols, dataKey]
                : state.selectedCols.filter((c) => c !== dataKey),
            }))
          }
          inputProps={{
            'aria-label': 'select all desserts',
          }}
        />
        <span>{dataKey}</span>
      </TableCell>
    );
  };

  render() {
    const { data, rowHeight, headerHeight, ...tableProps } = this.props;
    const { rows, headers, selectedCols } = this.state;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: 'inherit',
            }}
            headerHeight={headerHeight}
            rowCount={rows.length}
            rowGetter={({ index }) => rows[index]}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {headers.map((col, index) => {
              return (
                <Column
                  key={col}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      isSelected: selectedCols.indexOf(col) !== -1,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={col}
                  width="200"
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

export default styled(VirtualizedDataTable)(styles);
