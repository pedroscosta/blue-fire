import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import CustomTitlebar from './components/navigation/CustomTitlebar';
import store from './store/store';

render(<App />, document.getElementById('app'));
