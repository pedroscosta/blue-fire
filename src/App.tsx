import { ChakraProvider } from '@chakra-ui/react';
import './App.css';
import CustomTitlebar from './components/navigation/CustomTitlebar';
import Theme from './Theme';

const App: React.FC = () => {
  return (
    <ChakraProvider theme={Theme}>
      <div id="title" style={{ zIndex: 2000, height: 28 }}>
        <CustomTitlebar />
      </div>
      <div id="root"></div>
    </ChakraProvider>
  );
};

export default App;
