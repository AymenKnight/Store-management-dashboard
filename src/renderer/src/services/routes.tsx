import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/products',
    element: <div>products</div>,
  },
  {
    path: '/orders',
    element: <div>orders</div>,
  },
  {
    path: '/customers',
    element: <div>customers</div>,
  },
  {
    path: '/payments',
    element: <div>payments</div>,
  },
  {
    path: '/settings',
    element: <div>settings</div>,
  },
]);
export default router;
