/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';

function AnalyticsTab({ loadedData, dispatch }) {
  return <div>{JSON.stringify(loadedData)}</div>;
}

export default connect((state) => ({ loadedData: state.loadedData }))(
  AnalyticsTab
);
