import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Chart from './components/Chart.tsx';

// browser router
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: '/:year/:country/:town',
          element: <Chart />,
        },
      ],
    },
  ],
  { basename: '/BD-assignment' },
);

// hash router
// const router = createHashRouter([
//   {
//     path: '/',
//     element: <App />,
//     children: [
//       {
//         path: '/:year/:country/:town',
//         element: <Chart />,
//       },
//     ],
//   },
// ]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
