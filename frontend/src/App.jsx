import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import clsx from "clsx";
import { InfinitySpin } from "react-loader-spinner";
import MainLayout from "./layout/MainLayout";
import ErrorPage from "./pages/feedback/ErrorPage";
import NotFound from "./pages/feedback/NotFound";

const Login = lazy(() => import("./pages/Login"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));
const VerificationMessage = lazy(() => import("./pages/VerificationMessage"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Notifications = lazy(() => import("./pages/Notifications"));

const User = lazy(() => import("./pages/User"));
const CreateUser = lazy(() => import("./pages/User/CreateUser"));
const EditUser = lazy(() => import("./pages/User/EditUser"));

const UserPermission = lazy(() => import("./pages/UserPermission"));
const CreateUserPermission = lazy(
  () => import("./pages/UserPermission/CreateUserPermission"),
);
const EditUserPermission = lazy(
  () => import("./pages/UserPermission/EditUserPermission"),
);
const EmailTemplate = lazy(() => import("./pages/EmailTemplate"));
const CreateEmailTemplate = lazy(
  () => import("./pages/EmailTemplate/CreateEmailTemplate"),
);
const EditEmailTemplate = lazy(
  () => import("./pages/EmailTemplate/EditEmailTemplate"),
);
const Settings = lazy(() => import("./pages/Settings"));

const Portal = lazy(() => import("./pages/Portal"));
const ViewPortal = lazy(() => import("./pages/Portal/ViewPortal"));

const Quote = lazy(() => import("./pages/Quote"));
const CreateQuote = lazy(() => import("./pages/Quote/CreateQuote"));
const EditQuote = lazy(() => import("./pages/Quote/EditQuote"));
const ViewQuote = lazy(() => import("./pages/Quote/ViewQuote"));

const QuoteMaster = lazy(() => import("./pages/QuoteMaster"));
const CreateQuoteMaster = lazy(
  () => import("./pages/QuoteMaster/CreateQuoteMaster"),
);
const EditQuoteMaster = lazy(
  () => import("./pages/QuoteMaster/EditQuoteMaster"),
);

const ProductCategory = lazy(() => import("./pages/ProductCategory"));
const CreateProductCategory = lazy(
  () => import("./pages/ProductCategory/CreateProductCategory"),
);
const EditProductCategory = lazy(
  () => import("./pages/ProductCategory/EditProductCategory"),
);

const Attribute = lazy(() => import("./pages/Attribute"));
const CreateAttribute = lazy(() => import("./pages/Attribute/CreateAttribute"));
const EditAttribute = lazy(() => import("./pages/Attribute/EditAttribute"));

const Product = lazy(() => import("./pages/Product"));
const CreateProduct = lazy(() => import("./pages/Product/CreateProduct"));
const EditProduct = lazy(() => import("./pages/Product/EditProduct"));
const ViewProduct = lazy(() => import("./pages/Product/ViewProduct"));
const PreviewProduct = lazy(() => import("./pages/Product/PreviewProduct"));
const Shop = lazy(() => import("./pages/Shop"));
const ViewShopItem = lazy(() => import("./pages/Shop/ViewShopItem"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));
const ViewOrder = lazy(() => import("./pages/Orders/ViewOrder"));

const PageLoader = ({ fullScreen = false }) => (
  <div
    className={clsx(
      "flex h-full items-center justify-center",
      fullScreen && "h-screen",
    )}
  >
    <InfinitySpin visible={true} width="200" color="#ce0105" />
  </div>
);

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: "/notifications",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Notifications />
            </Suspense>
          ),
        },
        {
          path: "/user-management",
          element: (
            <Suspense fallback={<PageLoader />}>
              <User />
            </Suspense>
          ),
        },
        {
          path: "/user-management/create",
          element: (
            <Suspense fallback={<PageLoader />}>
              <CreateUser />
            </Suspense>
          ),
        },
        {
          path: "/user-management/edit/:id",
          element: (
            <Suspense fallback={<PageLoader />}>
              <EditUser />
            </Suspense>
          ),
        },
        {
          path: "/user-permission",
          element: (
            <Suspense fallback={<PageLoader />}>
              <UserPermission />
            </Suspense>
          ),
        },
        {
          path: "/user-permission/create",
          element: (
            <Suspense fallback={<PageLoader />}>
              <CreateUserPermission />
            </Suspense>
          ),
        },
        {
          path: "/user-permission/edit/:id",
          element: (
            <Suspense fallback={<PageLoader />}>
              <EditUserPermission />
            </Suspense>
          ),
        },
        {
          path: "/email-template",
          element: (
            <Suspense fallback={<PageLoader />}>
              <EmailTemplate />
            </Suspense>
          ),
        },
        {
          path: "/email-template/create",
          element: (
            <Suspense fallback={<PageLoader />}>
              <CreateEmailTemplate />
            </Suspense>
          ),
        },
        {
          path: "/email-template/edit/:id",
          element: (
            <Suspense fallback={<PageLoader />}>
              <EditEmailTemplate />
            </Suspense>
          ),
        },
        {
          path: "/portal",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Portal />
            </Suspense>
          ),
        },
        {
          path: "/portal/:id",
          element: (
            <Suspense fallback={<PageLoader />}>
              <ViewPortal />
            </Suspense>
          ),
        },
        {
          path: "/settings",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Settings />
            </Suspense>
          ),
        },
        {
          path: "/quote",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Quote />
            </Suspense>
          ),
        },
        {
          path: "/quote/create",
          element: (
            <Suspense fallback={<PageLoader />}>
              <CreateQuote />
            </Suspense>
          ),
        },
        {
          path: "/quote/edit/:id",
          element: (
            <Suspense fallback={<PageLoader />}>
              <EditQuote />
            </Suspense>
          ),
        },
        {
          path: "/quote/view/:id",
          element: (
            <Suspense fallback={<PageLoader />}>
              <ViewQuote />
            </Suspense>
          ),
        },
        {
          path: "/quote-master",
          element: (
            <Suspense fallback={<PageLoader />}>
              <QuoteMaster />
            </Suspense>
          ),
        },
        {
          path: "/quote-master/create",
          element: (
            <Suspense fallback={<PageLoader />}>
              <CreateQuoteMaster />
            </Suspense>
          ),
        },
        {
          path: "/quote-master/edit/:id",
          element: (
            <Suspense fallback={<PageLoader />}>
              <EditQuoteMaster />
            </Suspense>
          ),
        },
        {
          path: "/product-category",
          element: (
            <Suspense fallback={<PageLoader />}>
              <ProductCategory />
            </Suspense>
          ),
        },
        {
          path: "/product-category/create",
          element: (
            <Suspense fallback={<PageLoader />}>
              <CreateProductCategory />
            </Suspense>
          ),
        },
        {
          path: "/product-category/edit/:id",
          element: (
            <Suspense fallback={<PageLoader />}>
              <EditProductCategory />
            </Suspense>
          ),
        },
        {
          path: "/attribute",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Attribute />
            </Suspense>
          ),
        },
        {
          path: "/attribute/create",
          element: (
            <Suspense fallback={<PageLoader />}>
              <CreateAttribute />
            </Suspense>
          ),
        },
        {
          path: "/attribute/edit/:id",
          element: (
            <Suspense fallback={<PageLoader />}>
              <EditAttribute />
            </Suspense>
          ),
        },
        {
          path: "/product",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Product />
            </Suspense>
          ),
        },
        {
          path: "/product/create",
          element: (
            <Suspense fallback={<PageLoader />}>
              <CreateProduct />
            </Suspense>
          ),
        },
        {
          path: "/product/preview",
          element: (
            <Suspense fallback={<PageLoader />}>
              <PreviewProduct />
            </Suspense>
          ),
        },
        {
          path: "/product/view/:id",
          element: (
            <Suspense fallback={<PageLoader />}>
              <ViewProduct />
            </Suspense>
          ),
        },
        {
          path: "/product/edit/:id",
          element: (
            <Suspense fallback={<PageLoader />}>
              <EditProduct />
            </Suspense>
          ),
        },
        {
          path: "/shop",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Shop />
            </Suspense>
          ),
        },
        {
          path: "/shop/:id",
          element: (
            <Suspense fallback={<PageLoader />}>
              <ViewShopItem />
            </Suspense>
          ),
        },
        {
          path: "/cart",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Cart />
            </Suspense>
          ),
        },
        {
          path: "/checkout",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Checkout />
            </Suspense>
          ),
        },
        {
          path: "/orders",
          element: (
            <Suspense fallback={<PageLoader />}>
              <Orders />
            </Suspense>
          ),
        },
        {
          path: "/orders/:id",
          element: (
            <Suspense fallback={<PageLoader />}>
              <ViewOrder />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "/login",
      errorElement: <ErrorPage />,
      element: (
        <Suspense fallback={<PageLoader fullScreen />}>
          <Login />
        </Suspense>
      ),
    },
    {
      path: "/email-verification",
      errorElement: <ErrorPage />,
      element: (
        <Suspense fallback={<PageLoader fullScreen />}>
          <EmailVerification />
        </Suspense>
      ),
    },
    {
      path: "/verification-message/:email",
      errorElement: <ErrorPage />,
      element: (
        <Suspense fallback={<PageLoader fullScreen />}>
          <VerificationMessage />
        </Suspense>
      ),
    },
    {
      path: "/reset-password",
      errorElement: <ErrorPage />,
      element: (
        <Suspense fallback={<PageLoader fullScreen />}>
          <ResetPassword />
        </Suspense>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
