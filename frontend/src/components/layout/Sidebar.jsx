import { Layout, Menu } from "antd";
import {
  Boxes,
  CircleChevronLeft,
  Folder,
  ListChecks,
  ShoppingBasket,
  ShoppingCart,
  TagIcon,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import { toggleSidebar } from "../../store/features/sidebarSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const activeKey = pathname === "/" ? "/" : pathname.split("/")[1];
  const { isCollapsed } = useSelector((state) => state.sidebar);
  const { user } = useSelector((state) => state.auth);
  const permissions = user?.permission;

  let isSmallScreen = window.innerWidth <= 1000;

  const items = [
    {
      key: "/",
      icon: (
        <svg
          width="19"
          height="17"
          viewBox="0 0 19 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.314978 7.73871L3.16261 5.16228V2.18606C3.16261 1.64792 3.6446 1.2118 4.24026 1.2118C4.83456 1.2118 5.31655 1.64792 5.31655 2.18606V3.21352L7.43684 1.29509C8.48513 0.347146 10.3078 0.348828 11.3537 1.2968L18.4738 7.73871C18.8941 8.11976 18.8941 8.73631 18.4738 9.11677C18.0533 9.49771 17.3705 9.49771 16.9502 9.11677L9.83071 2.67469C9.59878 2.46594 9.18999 2.46594 8.95927 2.67407L1.83858 9.11677C1.62744 9.30725 1.35216 9.402 1.07695 9.402C0.801176 9.402 0.525438 9.30715 0.314938 9.11677C-0.105532 8.73634 -0.105532 8.11979 0.314978 7.73871Z"
            fill="white"
          />
          <path
            d="M9.02014 4.52407C9.227 4.33701 9.56194 4.33701 9.76819 4.52407L16.0311 10.1888C16.13 10.2782 16.186 10.4003 16.186 10.5278V14.6594C16.186 15.6289 15.3172 16.415 14.2456 16.415H11.1449V12.0703H7.64415V16.415H4.54334C3.47183 16.415 2.60298 15.6289 2.60298 14.6595V10.5278C2.60298 10.4003 2.65854 10.2782 2.75792 10.1888L9.02014 4.52407Z"
            fill="white"
          />
        </svg>
      ),
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "administrator",
      label: "Administrator",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 19 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.2372 14.3314L18.7896 12.1682L17.9412 11.9914C17.9281 11.8937 17.9098 11.7962 17.8876 11.6999L18.6262 11.2823L17.3255 9.39926L16.5869 9.81678C16.5012 9.75647 16.4131 9.69849 16.3215 9.64478L16.5175 8.87655L14.1252 8.37773L13.9305 9.14625C13.8226 9.158 13.7147 9.17461 13.6076 9.19588L13.1447 8.52642L11.6583 9.36798C11.1354 9.13848 10.5811 8.94686 9.99909 8.81322C11.4505 7.92971 12.4505 6.1887 12.4505 4.61931C12.4505 2.4061 10.4661 0.611191 8.0205 0.611191C5.57486 0.611191 3.59112 2.40542 3.59112 4.61931C3.59112 6.1886 4.59029 7.92961 6.04224 8.81322C2.57113 9.60865 0 12.3349 0 14.3551C0 15.5485 4.01009 16.1447 8.01986 16.1447L5.77366 14.1127L7.6653 9.97519H7.64608L6.91098 9.21239C7.26565 9.32826 7.63653 9.39751 8.0205 9.39751C8.40426 9.39751 8.7745 9.32826 9.12906 9.21346L8.39406 9.97461H8.37614L10.2675 14.112L8.02147 16.1446C9.50455 16.1446 10.9877 16.063 12.2675 15.8997L14.5998 16.3888L14.7959 15.6207C14.9044 15.6082 15.0129 15.5922 15.1201 15.571L15.5809 16.2393L17.6602 15.0623L17.1994 14.3947C17.268 14.3172 17.3308 14.2368 17.3895 14.1539L18.2372 14.3314ZM17.0455 13.4609C16.8887 13.7821 16.6574 14.0783 16.3626 14.3266L16.7384 14.8713L15.7945 15.4054L15.4181 14.8601C15.0415 14.9914 14.6467 15.0505 14.2598 15.0363L14.099 15.662L13.0145 15.4349L13.1734 14.8103C12.8179 14.6671 12.491 14.459 12.2171 14.1917L11.6138 14.5323L11.0228 13.6772L11.6255 13.3366C11.4803 12.9947 11.4164 12.6399 11.4295 12.2874L10.7385 12.1431L10.9902 11.1609L11.6811 11.3045C11.8387 10.9833 12.07 10.6883 12.3655 10.4388L11.9896 9.89351L12.9322 9.36002L13.3093 9.90536C13.6859 9.77395 14.08 9.71607 14.4689 9.72918L14.6272 9.10342L15.7148 9.32933L15.5554 9.95392C15.9109 10.0981 16.2352 10.3064 16.511 10.5737L17.1123 10.233L17.7039 11.0888L17.102 11.4289C17.2457 11.7689 17.3111 12.1267 17.2967 12.4774L17.987 12.6217L17.736 13.6052L17.0455 13.4609Z"
            fill="white"
          />
        </svg>
      ),
      disabled:
        !permissions?.user?.list &&
        !permissions?.user_permission?.list &&
        !permissions?.settings?.list &&
        !permissions["email-template"]?.list,
      children: [
        {
          key: "user-management",
          label: <Link to="/user-management">User Management</Link>,
          disabled: !permissions?.user?.list,
        },
        {
          key: "user-permission",
          label: <Link to="/user-permission">User Permission</Link>,
          disabled: !permissions?.user_permission?.list,
        },

        {
          key: "email-template",
          label: <Link to="/email-template">Email Template</Link>,
          disabled: !permissions["email-template"]?.list,
        },
        {
          key: "settings",
          label: <Link to="/settings">Settings</Link>,
          disabled: !permissions?.settings?.list,
        },
      ],
    },
    {
      key: "portal",
      label: <Link to="/portal">Portal</Link>,
      disabled: !permissions?.portal?.list,
      icon: <Folder size={20} fill="white" />,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 3L3 8.2V21h6l2.9-3l3.1 3h6V8.2zM7.9 20v-6l3 3zm1-7h6l-3 3zm7 7l-3-3l3-3zm-.9-9H8.8V9H15z"
          />
        </svg>
      ),
      key: "quote-master",
      label: <Link to="/quote-master">Quote Master</Link>,
      disabled: !permissions["parlour-master"]?.list,
    },
    {
      key: "quote",
      label: <Link to="/quote">Quote Request</Link>,
      disabled: !permissions["parlour-request"]?.list,
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 18 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 9.37432C5.96827e-05 9.20403 0.0349706 9.03556 0.102563 8.8794C0.170155 8.72324 0.268984 8.58272 0.392906 8.46658L8.24731 1.10902C8.35921 1.01282 8.50162 0.959961 8.64886 0.959961C8.79611 0.959961 8.93852 1.01282 9.05042 1.10902L16.9048 8.46658C17.0287 8.58272 17.1276 8.72324 17.1952 8.8794C17.2628 9.03556 17.2977 9.20403 17.2977 9.37432V16.4823C17.2977 16.7269 17.2498 16.9691 17.1567 17.1951C17.0635 17.4211 16.927 17.6264 16.7549 17.7994C16.5828 17.9724 16.3785 18.1096 16.1536 18.2032C15.9288 18.2968 15.6878 18.345 15.4444 18.345H1.85333C1.36179 18.345 0.890394 18.1487 0.542827 17.7994C0.195261 17.4501 0 16.9763 0 16.4823V9.37432ZM8.36469 11.8256H8.33998H6.79924V8.10025H10.5059V11.8256H8.95775H8.93181H8.36592H8.36469ZM5.86393 16.7927H5.88988H6.457H6.48171H8.03109V13.0674H4.32443V16.7927H5.86393ZM10.8333 16.7927H10.8074H9.26664V13.0674H12.9733V16.7927H11.4251H11.4004H10.8333Z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      key: "product-category",
      label: <Link to="/product-category">Product Category</Link>,
      icon: <TagIcon size={20} fill="white" />,
      disabled: !permissions["product-category"]?.list,
    },
    {
      key: "attribute",
      label: <Link to="/attribute">Attribute</Link>,
      icon: <ListChecks size={22} fill="white" />,
      disabled: !permissions["attribute"]?.list,
    },
    {
      key: "product",
      label: <Link to="/product">Product</Link>,
      icon: <Boxes size={22} />,
      disabled: !permissions["product"]?.list,
    },
    {
      key: "shop",
      label: <Link to="/shop">Shop</Link>,
      icon: <ShoppingCart fill="white" size={20} />,
      disabled: !permissions["shop"]?.list,
    },
    {
      key: "orders",
      label: <Link to="/orders">Orders</Link>,
      icon: <ShoppingBasket fill="white" size={20} />,
      disabled: !permissions["order"]?.list,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      isSmallScreen = window.innerWidth <= 1000;
      dispatch(toggleSidebar(isSmallScreen));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout.Sider
      collapsedWidth="0"
      theme="light"
      collapsed={isCollapsed}
      className={`${isSmallScreen ? "!fixed" : "!sticky"} left-0 top-0 z-50 h-screen overflow-y-auto !bg-[#808080]`}
      width={230}
    >
      {isSmallScreen && (
        <CircleChevronLeft
          size={28}
          onClick={() => dispatch(toggleSidebar(!isCollapsed))}
          className="text-gray-1 absolute right-1 top-1 cursor-pointer rounded-full hover:bg-[#9993]"
        />
      )}
      <div className="h-26 w-full">
        <img src={Logo} alt="logo" className="h-full w-full object-contain" />
      </div>
      <Menu
        mode="inline"
        selectedKeys={[activeKey]}
        className="border-none bg-[#808080]"
        onClick={() => {
          if (window.innerWidth <= 1000) {
            dispatch(toggleSidebar(!isCollapsed));
          }
        }}
        items={items}
      />
    </Layout.Sider>
  );
};
export default Sidebar;
