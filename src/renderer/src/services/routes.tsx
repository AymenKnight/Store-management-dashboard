import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { BiSolidDashboard } from 'react-icons/bi';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { RiShoppingBag3Fill } from 'react-icons/ri';
import { MdGroups } from 'react-icons/md';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'sellers',
        element: <div>sellers</div>,
        children: [
          {
            path: ':sellerId',
            element: <div>seller detail</div>,
          },
        ],
      },
      {
        path: 'sales-analytics',
        element: <div>sales analytics</div>,
      },
      {
        path: 'top-products',
        element: <div>top products</div>,
      },
      {
        path: 'products-grid',
        element: <div>products grid</div>,
      },
      {
        path: 'products-management',
        element: <div>products management</div>,
      },
    ],
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

export const routesData: {
  mainRouteName: string;
  mainRouteIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  routes?: {
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    path: string;
    onClick?: () => void;
  }[];
}[] = [
  {
    mainRouteName: 'Dashboard',
    mainRouteIcon: BiSolidDashboard,
    routes: [
      {
        name: 'sales analytics',
        path: 'sales-analytics',
        icon: IoDocumentTextSharp,
        onClick: () => {
          console.log('sales analytics');
        },
      },
      {
        name: 'sellers list',
        path: 'sellers',
        icon: MdGroups,
      },
    ],
  },
  {
    mainRouteName: 'Products',
    mainRouteIcon: BiSolidDashboard,
    routes: [
      {
        name: 'Products grid',
        path: `products-grid`,
        icon: RiShoppingBag3Fill,
        onClick: () => {
          console.log('products');
        },
      },
      {
        name: 'Products management',
        path: 'products-management',
        icon: IoDocumentTextSharp,
        onClick: () => {
          console.log('products');
        },
      },

      {
        name: 'top products',
        path: 'top-products',
        icon: MdGroups,
        onClick: () => {
          console.log('products');
        },
      },
    ],
  },
];

export default router;
