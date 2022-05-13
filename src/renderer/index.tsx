import { render } from 'react-dom';
import App from './App';
import CustomTitlebar from './components/navigation/CustomTitlebar';

render(<CustomTitlebar />, document.getElementById('title'));
render(<App />, document.getElementById('root'));
