/* eslint-disable react/prop-types */
import { connect } from 'react-redux';
import { AutoSizer } from 'react-virtualized';
import GridLayout from '../components/grid/GridLayout';
import Sidebar from '../components/sidebar/Sidebar';

function AnalyticsTab({ loadedData, dispatch }) {
  return (
    <>
      <div style={{ flex: '1 1 auto', display: 'flex' }}>
        <AutoSizer>
          {({ height, width }) => <GridLayout height={height} width={width} />}
        </AutoSizer>
      </div>
      <Sidebar />
    </>
  );
}

export default connect((state) => ({ loadedData: state.loadedData }))(
  AnalyticsTab
);
