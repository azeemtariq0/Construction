import { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import PageLoader from './components/LoadingSpinners/PageLoader';
import MainLayout from './layouts/MainLayout';
import ErrorPage from './pages/feedback/ErrorPage';
import NotFound from './pages/feedback/NotFound';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ExpenseType = lazy(() => import('./pages/ExpenseType'));

const Expense = lazy(() => import('./pages/Expense'));
const CreateExpense = lazy(() => import('./pages/Expense/CreateExpense'));
const EditExpense = lazy(() => import('./pages/Expense/EditExpense'));

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
        },
        {
          path: '/expense',
          element: (
            <Suspense fallback={<PageLoader />}>
              <Expense />
            </Suspense>
          )
        },
        {
            path: '/expense/create',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreateExpense />
              </Suspense>
            )
          },
          {
            path: '/expense/edit/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditExpense />
              </Suspense>
            )
          },
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
