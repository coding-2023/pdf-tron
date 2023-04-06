import {createBrowserRouter} from 'react-router-dom';
import App from './App';
import NotFound404 from './NotFound404';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound404 />,
  },
]);
