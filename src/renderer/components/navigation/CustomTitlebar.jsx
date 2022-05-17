/* eslint-disable react/prop-types */
/* eslint-disable import/no-named-as-default */
import React, { useState } from 'react';
import TitleBar from 'frameless-titlebar';
import { connect } from 'react-redux';
import icon from '../../../../assets/icon.png';
import { useMenu } from './menu';

const CustomTitlebar = ({ store, dispatch }) => {
  /*
  // manage window state, default to currentWindow maximized state
  const [maximized, setMaximized] = useState(window.isMaximized());
  // add window listeners for currentWindow
  useEffect(() => {
    const onMaximized = () => setMaximized(true);
    const onRestore = () => setMaximized(false);
    window.on("maximize", onMaximized);
    window.on("unmaximize", onRestore);
    return () => {
      window.removeListener("maximize", onMaximized);
      window.removeListener("unmaximize", onRestore);
    }
  }, []);

  // used by double click on the titlebar
  // and by the maximize control button
  const handleMaximize = () => {
    if (maximized) {
      window.restore();
    } else {
      window.maximize();
    }
  } */

  const defaultMenu = useMenu(store);

  return (
    <TitleBar
      iconSrc={icon} // app icon
      currentWindow={window} // electron window instance
      platform="win32" // win32, darwin, linux
      theme={
        {
          // any theme overrides specific
          // to your application :)
        }
      }
      title="BlueFire"
      onClose={() => window.electron.closeWindow()}
      onMinimize={() => window.electron.minimizeWindow()}
      onMaximize={() => window.electron.maximizeWindow()}
      // when the titlebar is double clicked
      onDoubleClick={() => window.electron.maximizeWindow()}
      // hide minimize windows control
      disableMinimize={false}
      // hide maximize windows control
      disableMaximize={false}
      // is the current window maximized?
      maximized={window.electron.isWindowMaximized()}
      menu={defaultMenu}
    >
      {/* custom titlebar items */}
    </TitleBar>
  );
};

export default connect((state) => ({
  store: state,
}))(CustomTitlebar);
