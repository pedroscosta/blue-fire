/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AutoSizer } from 'react-virtualized';
import Sidebar from '../components/sidebar/Sidebar';
import GridLayout from '../components/grid/GridLayout';

function AnalyticsTab({ loadedData, dispatch }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ flex: '1 1 auto', display: 'flex' }}>
        <AutoSizer>
          {({ height, width }) => <GridLayout height={height} width={width} />}
        </AutoSizer>
      </div>
      <Sidebar />
    </DndProvider>
  );
}

export default connect((state) => ({ loadedData: state.loadedData }))(
  AnalyticsTab
);
