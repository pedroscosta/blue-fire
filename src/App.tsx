import { ChakraProvider } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import CustomTitlebar from './components/navigation/CustomTitlebar';
import MovableTabs from './components/navigation/MovableTabs';
import Theme from './theme';

const loadExtensions = async () => {
  const exts = await ipcBridge.getActiveExtensions();

  exts.forEach(async (ext: any) => {
    const extMain = await import(/* @vite-ignore */ ext.url);
    extMain.activate();
  });
};

loadExtensions();

const App: React.FC = () => {
  return (
    <ChakraProvider theme={Theme}>
      <DndProvider backend={HTML5Backend}>
        <div id="title" style={{ zIndex: 2000, height: 28 }}>
          <CustomTitlebar />
        </div>
        <div id="root">
          <MovableTabs />
        </div>
      </DndProvider>
    </ChakraProvider>
  );
};

export default App;
