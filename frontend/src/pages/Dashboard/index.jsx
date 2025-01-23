import { Button, Checkbox, Col, Image, Modal, Row, Upload } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardCard from "../../components/Cards/DashboardCard";
import useError from "../../hooks/useError";
import {
  getDashboardData,
  setBannerImage,
  setBannerVisibleFor,
  updateBanner,
} from "../../store/features/dashboardSlice";
import {
  Boxes,
  ListChecks,
  Settings,
  ShoppingBasket,
  ShoppingCart,
  TagIcon,
  User,
  UserCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ImagePlaceholder from "../../assets/images/img-placeholder.png";
import { setQuoteListParams } from "../../store/features/quoteSlice";
import { convertFileToBase64 } from "../../components/Forms/Quote/Step9Form";
import { API_URL } from "../../axiosInstance";
import { miniSerializeError } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const ListIcon = ({ fill, width = "30", height = "30" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 35 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M31.1111 3.88889V31.1111H3.88889V3.88889H31.1111ZM33.25 0H1.75C0.777778 0 0 0.777778 0 1.75V33.25C0 34.0278 0.777778 35 1.75 35H33.25C34.0278 35 35 34.0278 35 33.25V1.75C35 0.777778 34.0278 0 33.25 0ZM15.5556 7.77778H27.2222V11.6667H15.5556V7.77778ZM15.5556 15.5556H27.2222V19.4444H15.5556V15.5556ZM15.5556 23.3333H27.2222V27.2222H15.5556V23.3333ZM7.77778 7.77778H11.6667V11.6667H7.77778V7.77778ZM7.77778 15.5556H11.6667V19.4444H7.77778V15.5556ZM7.77778 23.3333H11.6667V27.2222H7.77778V23.3333Z"
      fill={fill}
    />
  </svg>
);

const NavItem = ({ icon, children }) => {
  return (
    <div className="flex h-full w-full cursor-pointer items-center gap-2 rounded-md border bg-white p-4 text-black transition-all hover:bg-slate-50 hover:text-black">
      {icon}
      <div>{children}</div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleError = useError();
  const { user } = useSelector((state) => state.auth);
  const {
    isLoading,
    totalQuote,
    quoteSubmitted,
    quoteUnderReview,
    quoteProcessed,
    currentBanner,
    currentVisibleFor,
    bannerImage,
    deletedBannerImage,
    bannerVisibleFor,
    isBannerUpdating,
  } = useSelector((state) => state.dashboard);

  const permissions = user?.permission;
  const [bannerModalIsOpen, setBannerModalIsOpen] = useState(false);

  const isBannerVisible = currentVisibleFor?.includes(user?.user_type);

  const toggleBannerModal = () => {
    setBannerModalIsOpen((prev) => !prev);
  };

  useEffect(() => {
    dispatch(
      getDashboardData({
        user_id: user?.user_id,
        user_type: user?.user_type,
      }),
    )
      .unwrap()
      .catch(handleError);
  }, []);

  const navItems = [
    {
      icon: <User size={22} />,
      title: "User Management",
      link: "/user-management",
      hide: !permissions?.user?.list,
    },
    {
      icon: <UserCheck size={22} />,
      title: "User Permission",
      link: "/user-permission",
      hide: !permissions?.user_permission?.list,
    },
    {
      icon: <Settings size={20} />,
      title: "Settings",
      link: "/settings",
      hide: !permissions?.settings?.list,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
        >
          <path d="M12 3L3 8.2V21h6l2.9-3l3.1 3h6V8.2zM7.9 20v-6l3 3zm1-7h6l-3 3zm7 7l-3-3l3-3zm-.9-9H8.8V9H15z" />
        </svg>
      ),
      title: "Quote Master",
      link: "/quote-master",
      hide: !permissions["parlour-master"]?.list,
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 18 19"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 9.37432C5.96827e-05 9.20403 0.0349706 9.03556 0.102563 8.8794C0.170155 8.72324 0.268984 8.58272 0.392906 8.46658L8.24731 1.10902C8.35921 1.01282 8.50162 0.959961 8.64886 0.959961C8.79611 0.959961 8.93852 1.01282 9.05042 1.10902L16.9048 8.46658C17.0287 8.58272 17.1276 8.72324 17.1952 8.8794C17.2628 9.03556 17.2977 9.20403 17.2977 9.37432V16.4823C17.2977 16.7269 17.2498 16.9691 17.1567 17.1951C17.0635 17.4211 16.927 17.6264 16.7549 17.7994C16.5828 17.9724 16.3785 18.1096 16.1536 18.2032C15.9288 18.2968 15.6878 18.345 15.4444 18.345H1.85333C1.36179 18.345 0.890394 18.1487 0.542827 17.7994C0.195261 17.4501 0 16.9763 0 16.4823V9.37432ZM8.36469 11.8256H8.33998H6.79924V8.10025H10.5059V11.8256H8.95775H8.93181H8.36592H8.36469ZM5.86393 16.7927H5.88988H6.457H6.48171H8.03109V13.0674H4.32443V16.7927H5.86393ZM10.8333 16.7927H10.8074H9.26664V13.0674H12.9733V16.7927H11.4251H11.4004H10.8333Z"
          />
        </svg>
      ),
      title: "Quote Request",
      link: "/quote",
      hide: !permissions["parlour-request"]?.list,
    },
    {
      icon: <TagIcon size={22} />,
      title: "Product Category",
      link: "/product-category",
      hide: !permissions["product-category"]?.list,
    },
    {
      icon: <ListChecks size={22} />,
      title: "Attribute",
      link: "/attribute",
      hide: !permissions["attribute"]?.list,
    },
    {
      icon: <Boxes size={22} />,
      title: "Product",
      link: "/product",
      hide: !permissions["product"]?.list,
    },
    {
      icon: <ShoppingCart size={22} />,
      title: "Shop",
      link: "/shop",
      hide: !permissions["shop"]?.list,
    },
    {
      icon: <ShoppingBasket size={22} />,
      title: "Orders",
      link: "/orders",
      hide: !permissions["order"]?.list,
    },
  ].filter((item) => !item.hide);

  const onNavigateToQuote = (filter) => {
    dispatch(
      setQuoteListParams({
        status: filter,
      }),
    );
    navigate("/quote");
  };

  const onBannerSave = async () => {
    let base64Image = null;

    if (bannerImage && typeof bannerImage !== "string") {
      base64Image = await convertFileToBase64(bannerImage);
    }

    try {
      await dispatch(
        updateBanner({
          user_type: bannerVisibleFor,
          old_image: deletedBannerImage,
          image: base64Image,
        }),
      ).unwrap();
      toggleBannerModal();
      toast.success("Banner updated successfully");
      await dispatch(
        getDashboardData({
          user_id: user?.user_id,
          user_type: user?.user_type,
        }),
      ).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      {isBannerVisible && (
        <div className="h-48 w-full overflow-hidden rounded-lg">
          <img
            src={
              currentBanner
                ? `${API_URL}/public/banners/${currentBanner}`
                : null
            }
            className="h-full w-full"
          />
        </div>
      )}

      <div className="mb-4 mt-1 flex justify-end">
        {user.user_type === "Internal" && (
          <Button onClick={toggleBannerModal} icon={<Settings size={14} />}>
            Banner Settings
          </Button>
        )}

        <Modal
          title="Banner Settings"
          open={bannerModalIsOpen}
          onOk={toggleBannerModal}
          onCancel={toggleBannerModal}
          footer={null}
        >
          <div className="h-48 w-full overflow-hidden rounded-lg">
            <Image
              height={"100%"}
              width={"100%"}
              alt="Banner Image"
              fallback={ImagePlaceholder}
              src={
                bannerImage
                  ? typeof bannerImage === "string"
                    ? bannerImage
                    : URL.createObjectURL(bannerImage)
                  : null
              }
            />
          </div>
          <div className="my-2 flex justify-end gap-4">
            <Button onClick={() => dispatch(setBannerImage(null))}>
              Clear
            </Button>
            <Upload
              onChange={(e) => {
                dispatch(setBannerImage(e.file.originFileObj));
              }}
              action={""}
              showUploadList={false}
              customRequest={() => {}}
              accept="image/*"
            >
              <Button type="primary">Upload</Button>
            </Upload>
          </div>

          <p className="mb-1 text-sm font-semibold">Visible For:</p>
          <Checkbox.Group
            disabled={!bannerImage}
            options={[
              { value: "Partner", label: "Partner" },
              { value: "Internal", label: "Internal" },
            ]}
            value={bannerVisibleFor}
            onChange={(e) => dispatch(setBannerVisibleFor(e))}
          />

          <div className="my-4 flex justify-end gap-4">
            <Button block onClick={toggleBannerModal}>
              Cancel
            </Button>
            <Button
              type="primary"
              block
              onClick={onBannerSave}
              loading={isBannerUpdating}
            >
              Save
            </Button>
          </div>
        </Modal>
      </div>

      <Row gutter={[12, 12]} className="mb-4">
        {navItems.map((item, index) => (
          <Col span={24} lg={6} md={8} sm={12} key={index}>
            <Link to={item.link}>
              <NavItem icon={item.icon}>{item.title}</NavItem>
            </Link>
          </Col>
        ))}
      </Row>

      <Row gutter={[12, 12]}>
        <Col span={24} lg={6} md={8} sm={12}>
          <DashboardCard
            icon={<ListIcon fill="#ce0105" />}
            title={totalQuote}
            description="Total Quote"
            onClick={() => onNavigateToQuote(null)}
            bgColor="bg-white"
            iconBGColor="bg-[#EFD3D2]"
            isLoading={isLoading}
          />
        </Col>
        {user?.user_type === "Internal" && (
          <>
            <Col span={24} lg={6} md={8} sm={12}>
              <DashboardCard
                icon={<ListIcon fill="#fff" />}
                title={quoteSubmitted}
                description="Quote Submitted"
                bgColor="bg-[#DDCDFF]"
                iconBGColor="bg-[#2bff8e]"
                isLoading={isLoading}
                onClick={() => onNavigateToQuote("Submitted")}
              />
            </Col>
            <Col span={24} lg={6} md={8} sm={12}>
              <DashboardCard
                icon={<ListIcon fill="#fff" />}
                title={quoteUnderReview}
                description="Quote Under Review"
                bgColor="bg-[#D7E5FF]"
                iconBGColor="bg-[#AFCBFF]"
                isLoading={isLoading}
                onClick={() => onNavigateToQuote("Under Review")}
              />
            </Col>
            <Col span={24} lg={6} md={8} sm={12}>
              <DashboardCard
                icon={<ListIcon fill="#fff" />}
                title={quoteProcessed}
                description="Quote Processed"
                bgColor="bg-[#D9FFDD]"
                iconBGColor="bg-[#A8FFB2]"
                isLoading={isLoading}
                onClick={() => onNavigateToQuote("Processed")}
              />
            </Col>
            {/* <Col span={24} lg={6} md={8} sm={12}>
              <DashboardCard
                icon={<ListIcon fill="#fff" />}
                title={quoteExpired}
                description="Quote Expired"
                bgColor="bg-[#FFD9D9]"
                iconBGColor="bg-[#FFABAB]"
                isLoading={isLoading}
              />
            </Col> */}
          </>
        )}
      </Row>
    </div>
  );
};
export default Dashboard;
