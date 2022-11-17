import './App.css';
import CustomTitlebar from './components/navigation/CustomTitlebar';

const App: React.FC = () => {
  return (
    <>
      <div id="title" style={{zIndex: 2000, height: 28}}>
        <CustomTitlebar />
      </div>
      <div
        style={{
          flex: '1 1 100%',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
        id="root"
      ></div>
    </>
  );
};

export default App;
