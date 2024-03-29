import TitleBar from 'frameless-titlebar';
import icon from '../../../assets/blue-fire-512.png';

const CustomTitlebar = () => {
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
      onClose={() => ipcBridge.closeWindow()}
      onMinimize={() => ipcBridge.minimizeWindow()}
      onMaximize={() => ipcBridge.maximizeWindow()}
      // when the titlebar is double clicked
      onDoubleClick={() => ipcBridge.maximizeWindow()}
      // hide minimize windows control
      disableMinimize={false}
      // hide maximize windows control
      disableMaximize={false}
      // is the current window maximized?
      maximized={ipcBridge.isWindowMaximized()}
      menu={undefined}
    >
      {/* custom titlebar items */}
    </TitleBar>
  );
};

export default CustomTitlebar;
