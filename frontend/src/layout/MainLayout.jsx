import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useHref, useLocation } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import UpdatePasswordModal from "../components/Modals/UpdatePasswordModal";
import useError from "../hooks/useError";
import NotFound from "../pages/feedback/NotFound";
import { getNotificationList } from "../store/features/notificationsSlice";

const removeTrailingSlashes = (url) => url.replace(/\/+$/, "");
const MainLayout = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const location = useLocation();
  const href = removeTrailingSlashes(useHref());
  const { user } = useSelector((state) => state.auth);
  const permissions = user?.permission;

  if (!localStorage.getItem("token") || !user) {
    return (
      <Navigate
        to="/login"
        state={{ prevUrl: `${location.pathname}${location.search}` }}
      />
    );
  }

  useEffect(() => {
    if (user?.is_change_password === 0) {
      toast("Change Password Is Mandatory!", {
        duration: 6000,
        icon: (
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.9187 16.5L12.5854 3.66671C12.4255 3.38456 12.1936 3.14988 11.9134 2.98661C11.6332 2.82333 11.3147 2.7373 10.9904 2.7373C10.6661 2.7373 10.3476 2.82333 10.0674 2.98661C9.78718 3.14988 9.5553 3.38456 9.3954 3.66671L2.06207 16.5C1.90044 16.78 1.81569 17.0976 1.81641 17.4208C1.81713 17.7441 1.90328 18.0614 2.06614 18.3405C2.22901 18.6197 2.46279 18.8509 2.74379 19.0106C3.02479 19.1704 3.34303 19.253 3.66624 19.25H18.3329C18.6546 19.2497 18.9705 19.1648 19.2489 19.0037C19.5274 18.8427 19.7585 18.6112 19.9192 18.3326C20.0799 18.0539 20.1644 17.7379 20.1644 17.4162C20.1643 17.0946 20.0796 16.7786 19.9187 16.5Z"
              stroke="#FFC700"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11 8.25V11.9167"
              stroke="#FFC700"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11 15.5835H11.01"
              stroke="#FFC700"
              sstrokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      });
    } else {
      let intervalId;

      const fetchNotifications = () => {
        dispatch(
          getNotificationList({
            user_id: user?.user_id,
            user_type: user.user_type,
          }),
        )
          .unwrap()
          .catch(handleError);
      };

      fetchNotifications(); // Fetch notifications initially
      intervalId = setInterval(fetchNotifications, 10000);
      return () => intervalId && clearInterval(intervalId);
    }
  }, []);

  if (href === "/user-management" && !permissions.user.list)
    return <NotFound />;
  if (href === "/user-management/create" && !permissions.user.add)
    return <NotFound />;
  if (href.startsWith("/user-management/edit") && !permissions.user.edit)
    return <NotFound />;
  if (href === "/user-permission" && !permissions.user_permission.list)
    return <NotFound />;
  if (href === "/user-permission/create" && !permissions.user_permission.add)
    return <NotFound />;
  if (
    href.startsWith("/user-permission/edit") &&
    !permissions.user_permission.edit
  )
    return <NotFound />;
  if (href === "/quote-master" && !permissions["parlour-master"].list)
    return <NotFound />;
  if (href === "/quote-master/create" && !permissions["parlour-master"].add)
    return <NotFound />;
  if (
    href.startsWith("/quote-master/edit") &&
    !permissions["parlour-master"].edit
  )
    return <NotFound />;
  if (href === "/quote" && !permissions["parlour-request"].list)
    return <NotFound />;
  if (href === "/quote/create" && !permissions["parlour-request"].add)
    return <NotFound />;
  if (href.startsWith("/quote/edit") && !permissions["parlour-request"].edit)
    return <NotFound />;

  if (href === "/settings" && !permissions["settings"].list)
    return <NotFound />;

  if (href === "/attribute" && !permissions["attribute"].list)
    return <NotFound />;
  if (href === "/attribute/create" && !permissions["attribute"].add)
    return <NotFound />;
  if (href.startsWith("/attribute/edit") && !permissions["attribute"].edit)
    return <NotFound />;

  if (href === "/product" && !permissions["product"].list) return <NotFound />;

  if (href === "/product-category" && !permissions["product-category"].list)
    return <NotFound />;
  if (
    href === "/product-category/create" &&
    !permissions["product-category"].add
  )
    return <NotFound />;
  if (
    href.startsWith("/product-category/edit") &&
    !permissions["product-category"].edit
  )
    return <NotFound />;

  if (href === "/shop" && !permissions["shop"].list) return <NotFound />;

  if (href === "/orders" && !permissions["order"].list) return <NotFound />;
  if (href.startsWith("/orders/") && !permissions["order"].view)
    return <NotFound />;

  if (href === "/portal" && !permissions["portal"].list) return <NotFound />;
  if (href.startsWith("/portal/") && !permissions["portal"].view)
    return <NotFound />;

  if (href === "/email-template" && !permissions["email-template"].list)
    return <NotFound />;
  if (href === "/email-template/create" && !permissions["email-template"].add)
    return <NotFound />;
  if (
    href.startsWith("/email-template/edit") &&
    !permissions["email-template"].edit
  )
    return <NotFound />;

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout
        className={`${window.innerWidth <= 1000 ? "!w-screen" : "w-full"}`}
      >
        <Navbar />
        <Content className="bg-[#f2f2f2] p-4">
          <UpdatePasswordModal open={user?.is_change_password === 0} />
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
export default MainLayout;
