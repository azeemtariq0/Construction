import {
  Breadcrumb,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { ChevronsRight, Eye, Pen, RefreshCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../../hooks/useDebounce";
import useError from "../../hooks/useError";
import {
  buyAgainOrder,
  changeOrderStatus,
  getOrderList,
  setCancelOrderID,
  setOrderListParams,
} from "../../store/features/orderSlice";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import AsyncSelect from "../../components/AsyncSelect";

const { Title } = Typography;

const StatusCell = ({ record }) => {
  const { id, status } = record;
  const handleError = useError();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission["order"];

  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = async () => {
    try {
      await dispatch(
        changeOrderStatus({
          order_id: id,
          user_id: user.user_id,
          status: currentStatus,
        }),
      ).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#FFB26F";
      case "In Progress":
        return "#7E1891";
      case "Shipped":
        return "#88C273";
      case "Cancelled":
        return "#F95454";
      default:
        return "gray";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Tag color={getStatusColor(status)} className="w-20 text-center">
        {status}
      </Tag>

      {user.user_type === "Internal" &&
      status !== "Cancelled" &&
      permissions.edit ? (
        <Popconfirm
          title="Change Status"
          onConfirm={handleStatusChange}
          icon={null}
          onCancel={() => setCurrentStatus(status)}
          description={
            <div>
              <Select
                options={[
                  { value: "Pending", label: "Pending" },
                  { value: "In Progress", label: "In Progress" },
                  { value: "Shipped", label: "Shipped" },
                ]}
                className="w-full min-w-40"
                value={currentStatus}
                onChange={(value) => setCurrentStatus(value)}
              />
            </div>
          }
        >
          <Tooltip title="Change Status" placement="right">
            <Pen size={14} className="text-red-1 cursor-pointer" />
          </Tooltip>
        </Popconfirm>
      ) : null}
    </div>
  );
};

const Orders = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const handleError = useError();
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission["order"];
  const { params, list, isLoading, paginationInfo, cancelOrderID } =
    useSelector((state) => state.order);
  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedOrderNo = useDebounce(params.order_no, 500);
  const debouncedTotalAmount = useDebounce(params.total_amount, 500);

  const onBuyAgainOrder = async (id) => {
    try {
      await dispatch(
        buyAgainOrder({
          order_id: id,
          user_id: user.user_id,
        }),
      ).unwrap();
      await dispatch(
        getOrderList({
          ...params,
          user_id: user.user_id,
          user_type: user.user_type,
        }),
      ).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onCancelOrder = async ({ reason }) => {
    const payload = {
      order_id: cancelOrderID,
      user_id: user.user_id,
      cancel_reason: reason,
      status: "Cancelled",
    };

    try {
      dispatch(setCancelOrderID(null));
      await dispatch(changeOrderStatus(payload)).unwrap();
      toast.success("Order Cancelled Successfully");
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>Order No</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.order_no}
            onChange={(e) =>
              dispatch(setOrderListParams({ order_no: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "order_no",
      width: 100,
      sorter: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Order Date</p>
          <DatePicker
            className="font-normal"
            size="small"
            value={params.order_date ? dayjs(params.order_date) : null}
            format="DD-MM-YYYY"
            onChange={(date) =>
              dispatch(
                setOrderListParams({
                  order_date: date ? dayjs(date).format("YYYY-MM-DD") : null,
                }),
              )
            }
          />
        </div>
      ),
      dataIndex: "order_date",
      width: 120,
      render: (_, { order_date }) =>
        order_date ? dayjs(order_date).format("DD-MM-YYYY") : null,
      sorter: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Order By</p>
          <AsyncSelect
            className="w-full font-normal"
            size="small"
            endpoint="/user"
            labelKey="name"
            valueKey="id"
            allowClear
            showSearch
            value={params.order_by}
            onChange={(value) =>
              dispatch(setOrderListParams({ order_by: value }))
            }
          />
        </div>
      ),
      dataIndex: "user_name",
      width: 120,
      hide: user.user_type === "Partner",
      sorter: true,
    },
    {
      title: (
        <div>
          <p>Total Price</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.total_amount}
            onChange={(e) =>
              dispatch(setOrderListParams({ total_amount: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "total_amount",
      width: 120,
      sorter: true,
      hide: user.user_type === "Partner",
    },
    {
      title: (
        <div>
          <p>Status</p>
          <Select
            className="w-full font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            options={[
              { value: "Pending", label: "Pending" },
              { value: "In Progress", label: "In Progress" },
              { value: "Shipped", label: "Shipped" },
              { value: "Cancelled", label: "Cancelled" },
            ]}
            allowClear
            showSearch
            value={params.status}
            onChange={(value) =>
              dispatch(setOrderListParams({ status: value }))
            }
          />
        </div>
      ),
      dataIndex: "status",
      width: 120,
      render: (_, record) => <StatusCell record={record} />,
      sorter: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      width: user.user_type === "Partner" ? 120 : 80,
      fixed: "right",
      align: "center",
      render: (_, { id, status }) => (
        <div className="flex justify-center gap-2">
          {permissions.view ? (
            <Tooltip title="View">
              <Link to={`/orders/${id}`}>
                <Button icon={<Eye size={16} />} />
              </Link>
            </Tooltip>
          ) : null}
          <Tooltip title={status !== "Pending" ? null : "Cancel"} zIndex={2}>
            <Button
              type="primary"
              onClick={() => {
                form.resetFields();
                dispatch(setCancelOrderID(id));
              }}
              icon={<X size={16} />}
              disabled={status !== "Pending"}
              danger
            />
          </Tooltip>
          {user.user_type === "Partner" && (
            <Popconfirm
              title="Buy Again"
              description="Are you sure to buy again this order?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => onBuyAgainOrder(id)}
            >
              <Tooltip title="Buy Again" zIndex={2}>
                <Button type="primary" icon={<RefreshCcw size={16} />} />
              </Tooltip>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(
      getOrderList({
        ...params,
        user_id: user.user_id,
        user_type: user.user_type,
      }),
    )
      .unwrap()
      .catch(handleError);
  }, [
    debouncedSearch,
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.order_date,
    params.status,
    params.order_by,
    debouncedOrderNo,
    debouncedTotalAmount,
  ]);

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>ORDERS</Title>
        <Breadcrumb
          items={[
            {
              title: "Orders",
            },
            {
              title: "List",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="min-h-96 rounded-lg bg-white p-4">
        <Input
          placeholder="Search Here..."
          className="mb-4 w-full sm:w-52"
          value={params.search}
          onChange={(e) =>
            dispatch(
              setOrderListParams({
                ...params,
                search: e.target.value,
              }),
            )
          }
        />

        <Table
          columns={columns.filter((col) => !col.hide)}
          dataSource={list}
          loading={isLoading}
          size="small"
          rowHoverable={false}
          rowKey={"id"}
          scroll={{ y: 280, x: "calc(100% - 200px)" }}
          showSorterTooltip={false}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} orders`,
          }}
          onChange={(e, b, c, d) => {
            dispatch(
              setOrderListParams({
                ...params,
                page: e.current,
                limit: e.pageSize,
                sort_column: c.field,
                sort_direction: c.order,
              }),
            );
          }}
        />
      </div>

      <Modal
        title="Reason for Cancellation"
        open={cancelOrderID}
        onCancel={() => dispatch(setCancelOrderID(null))}
        footer={null}
      >
        {/* Ask reason for cancel order */}
        <Form
          layout="vertical"
          autoComplete="off"
          onFinish={onCancelOrder}
          form={form}
        >
          <Form.Item
            label=""
            name="reason"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter reason for cancellation",
              },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Enter reason..." />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button
              htmlType="button"
              onClick={() => dispatch(setCancelOrderID(null))}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default Orders;
