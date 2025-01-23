import { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import PageLoader from './components/LoadingSpinners/PageLoader';
import MainLayout from './layouts/MainLayout';
import ErrorPage from './pages/feedback/ErrorPage';
import NotFound from './pages/feedback/NotFound';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ExpenseType = lazy(() => import('./pages/ExpenseType'));

function Routes() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          )
        },
        {
          path: '/expense-type',
          element: (
            <Suspense fallback={<PageLoader />}>
              <ExpenseType />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '/login',
      element: (
        <Suspense fallback={<PageLoader />}>
          <Login />
        </Suspense>
      )
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]);

  return <RouterProvider router={router} />;
}

export default Routes;
