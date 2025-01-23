import {
  Avatar,
  Button,
  List,
  Pagination,
  Popconfirm,
  Radio,
  Tooltip,
} from "antd";
import { CheckCheck, Eye, Trash2, User2 } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../axiosInstance";
import useError from "../../hooks/useError";
import {
  deleteAllNotification,
  deleteNotification,
  getNotificationList,
  readAllNotification,
  setNotificationsListParams,
} from "../../store/features/notificationsSlice";
import { formatDate } from "../../utils/formateDate";

const NotificationItem = ({
  time,
  message,
  image,
  documentNo,
  username,
  id,
  isRead,
  onClick,
}) => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { user } = useSelector((state) => state.auth);
  const { deletingID, params } = useSelector((state) => state.notifications);

  const removeNotification = async () => {
    try {
      await dispatch(deleteNotification(id)).unwrap();
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

  return (
    <List.Item
      className="flex w-full cursor-pointer flex-wrap items-center justify-between gap-4 hover:bg-slate-50 md:flex-nowrap"
      onClick={onClick}
    >
      <div className="flex cursor-pointer items-center gap-2">
        <div className="self-start">
          <Avatar src={`${API_URL}/${image}`} icon={<User2 />} size={40} />
        </div>
        <div className="w-full">
          <div>
            <p className="text-xs font-semibold">
              {username}
              <span className="mx-1 font-medium text-gray-500">
                commented on
              </span>
              {documentNo}
            </p>
            <p className="text-wrap text-xs text-gray-500">{message}</p>
          </div>
        </div>
      </div>

      <div className="ml-auto flex min-w-[300px] items-center justify-end gap-4">
        {isRead === 1 ? (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Eye size={14} /> <span>Viewed</span>
          </div>
        ) : null}
        <div className="text-xs font-semibold">{time}</div>
        <Tooltip title="Delete">
          <Button
            loading={deletingID === id}
            shape="circle"
            onClick={removeNotification}
            icon={<Trash2 size={18} />}
            danger
          />
        </Tooltip>
      </div>
    </List.Item>
  );
};

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { user } = useSelector((state) => state.auth);
  const { list, params, totalRecords, isLoading, totalUnread } = useSelector(
    (state) => state.notifications,
  );

  useEffect(() => {
    dispatch(
      getNotificationList({
        ...params,
        limit: 10,
        user_id: user.user_id,
        user_type: user.user_type,
      }),
    )
      .unwrap()
      .catch(handleError);
  }, [params.page, params.status]);

  const data = list.map((item) => ({
    id: item.id,
    time: formatDate(item.created_at),
    message: item.message,
    image: item.image_url,
    documentNo: item.heading_text,
    username: item.name,
    isRead: item.is_read,
    request_id: item.request_id,
  }));

  const onBulkDelete = async () => {
    try {
      await dispatch(deleteAllNotification(user.user_id)).unwrap();
      toast.success("All notifications has been deleted.");
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

  const onNotificationClick = (quoteID) => {
    navigate(`/quote/view/${quoteID}#chat`);
  };

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold">Notifications</h2>
        <p className="text-gray-500">
          You've {totalUnread} unread notifications
        </p>
      </div>

      <div className="mt-2 rounded-lg bg-white p-2">
        <div className="my-2 flex flex-col-reverse items-center justify-between gap-2 sm:flex-row">
          <Radio.Group
            block
            options={[
              { value: null, label: "All" },
              { value: 0, label: "Unread" },
            ]}
            defaultValue="All"
            optionType="button"
            value={params.status}
            onChange={(e) =>
              dispatch(
                setNotificationsListParams({
                  ...params,
                  status: e.target.value,
                }),
              )
            }
          />
          <div className="flex gap-2">
            <Popconfirm
              title="Are you sure to delete all notifications?"
              okText="Yes"
              cancelText="No"
              onConfirm={onBulkDelete}
            >
              <Button type="primary" icon={<Trash2 size={18} />} danger>
                Delete all
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Are you sure to mark all notifications as read?"
              okText="Yes"
              cancelText="No"
              onConfirm={onReadAll}
            >
              <Button type="primary" icon={<CheckCheck size={18} />}>
                Mark all as read
              </Button>
            </Popconfirm>
          </div>
        </div>
        <div>
          <List
            size="small"
            bordered
            loading={isLoading && data.length === 0}
            className="max-h-80 overflow-y-auto"
            dataSource={data}
            renderItem={(item) => (
              <NotificationItem
                {...item}
                onClick={() => onNotificationClick(item.request_id)}
              />
            )}
          />
        </div>
        <div className="my-4 flex justify-center">
          <Pagination
            defaultCurrent={1}
            total={totalRecords}
            pageSize={10}
            current={params.page}
            onChange={(page) =>
              dispatch(setNotificationsListParams({ ...params, page }))
            }
            showTotal={() => `Total ${totalRecords}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
