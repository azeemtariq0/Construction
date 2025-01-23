import { Avatar, Badge, Button, Dropdown, Popconfirm } from "antd";
import { Bell, CheckCheck, User2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../axiosInstance";
import useError from "../../hooks/useError";
import {
  getNotificationList,
  readAllNotification,
} from "../../store/features/notificationsSlice";
import { formatDate } from "../../utils/formateDate";

const NotificationItem = ({
  time,
  message,
  image,
  documentNo,
  username,
  onClick,
  isViewed,
}) => {
  const messageText =
    message.length > 45 ? message.slice(0, 38) + "..." : message;
  return (
    <div
      className={`flex w-full cursor-pointer items-center gap-2 border-b border-gray-200 p-2 pb-1 hover:bg-slate-50 ${isViewed ? "bg-white" : "bg-sky-100"}`}
      onClick={onClick}
    >
      <div className="self-start">
        <Avatar src={`${API_URL}/${image}`} icon={<User2 />} size={40} />
      </div>
      <div className="w-full">
        <div>
          <p className="text-xs font-semibold">
            {username}
            <span className="mx-1 font-medium text-gray-500">commented on</span>
            {documentNo}
          </p>
          <p className="text-xs text-gray-500">{messageText}</p>
        </div>
        <p className="text-red-1 text-end text-[10px] font-semibold">{time}</p>
      </div>
    </div>
  );
};

const NotificationMenu = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { list, totalUnread, params } = useSelector(
    (state) => state.notifications,
  );

  const onReadAll = async () => {
    try {
      await dispatch(
        readAllNotification({
          user_id: user.user_id,
          user_type: user.user_type,
        }),
      ).unwrap();
      toast.success("All notifications has been marked as read.");
      dispatch(
        getNotificationList({
          ...params,
          limit: 10,
          user_id: user.user_id,
          user_type: user.user_type,
        }),
      );
    } catch (error) {
      handleError(error);
    }
  };

  const onNotificationClick = (notification) => {
    const { request_id, status } = notification;

    if (user.user_type === "Partner") {
      navigate(`/quote/view/${request_id}#chat`);
    } else {
      status === "Submitted"
        ? navigate(`/quote/view/${request_id}#chat`)
        : navigate(`/quote/edit/${request_id}#chat`);
    }

    setIsMenuOpen(false);
  };

  return (
    <Dropdown
      arrow
      open={isMenuOpen}
      onOpenChange={(e) => setIsMenuOpen(e)}
      trigger={["click"]}
      placement="bottom"
      dropdownRender={() => (
        <div className="w-[340px] overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 p-2 px-4 py-3">
            <div className="font-semibold">Notifications</div>
            {list.length > 0 && (
              <Popconfirm
                title="Are you sure to mark all notifications as read?"
                okText="Yes"
                cancelText="No"
                onConfirm={onReadAll}
              >
                <div className="flex cursor-pointer items-center gap-1 text-xs font-medium text-green-600 hover:underline">
                  <CheckCheck size={14} /> Mark all as read
                </div>
              </Popconfirm>
            )}
          </div>

          {list.length === 0 && (
            <div className="flex h-[120px] items-center justify-center">
              <p className="text-base font-semibold text-gray-500">
                No notifications
              </p>
            </div>
          )}

          {list.slice(0, 3).map((item) => (
            <NotificationItem
              key={item.id}
              time={formatDate(item.created_at)}
              message={item.message}
              image={item.image_url}
              documentNo={item.heading_text}
              username={item.name}
              isViewed={item.is_read}
              onClick={() => onNotificationClick(item)}
            />
          ))}

          {list.length > 0 && (
            <Link
              to="/notifications"
              className="hover:text-red-1 block cursor-pointer py-3 text-center text-xs font-semibold hover:bg-slate-50"
              onClick={() => setIsMenuOpen(false)}
            >
              View All
            </Link>
          )}
        </div>
      )}
    >
      <Badge count={totalUnread} color="#808080" offset={[-6, 4]}>
        <Button
          type="text"
          icon={<Bell size={28} color="#fff" />}
          onClick={() => setIsMenuOpen((pre) => !pre)}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationMenu;
