import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Image,
  Input,
  Row,
  Table,
  Tooltip,
} from "antd";
import Title from "antd/es/typography/Title";
import { ArrowLeft, ChevronsRight } from "lucide-react";
import { API_URL } from "../../axiosInstance";
import ImagePlaceholder from "../../assets/images/img-placeholder.png";
import { useDispatch, useSelector } from "react-redux";
import useError from "../../hooks/useError";
import { useEffect } from "react";
import {
  getOrderDetails,
  saveOrderDetails,
} from "../../store/features/orderSlice";
import { Link, useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const ViewOrder = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { id } = useParams();

  const { user } = useSelector((state) => state.auth);
  const { isItemLoading, orderDetails, isDetailsSubmitting } = useSelector(
    (state) => state.order,
  );

  const isPartner = user.user_type === "Partner";

  const items = [
    {
      key: "1",
      label: "First Name",
      children: <p>{orderDetails?.first_name || "-"}</p>,
    },
    {
      key: "2",
      label: "Last Name",
      children: <p>{orderDetails?.last_name || "-"}</p>,
    },
    {
      key: "3",
      label: "Organization",
      children: <p>{orderDetails?.organization || "-"}</p>,
    },
    {
      key: "4",
      label: "Country",
      children: <p>{orderDetails?.country || "-"}</p>,
    },
    {
      key: "5",
      label: "Phone Number",
      children: <p>{orderDetails?.phone_no || "-"}</p>,
    },
    {
      key: "6",
      label: "Post Code",
      children: <p>{orderDetails?.post_code || "-"}</p>,
    },
    {
      key: "7",
      label: "Address",
      children: <p>{orderDetails?.address || "-"}</p>,
    },
  ];

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      width: 120,
      render: (_, { image }) => (
        <div className="h-16 w-16 overflow-hidden rounded-md">
          <Image
            className="h-full w-full"
            title="image"
            src={image}
            fallback={ImagePlaceholder}
          />
        </div>
      ),
    },
    {
      title: "Product",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "Part No",
      dataIndex: "part_no",
      width: 100,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: 80,
    },
    {
      title: "Price",
      dataIndex: "price",
      width: 80,
      hide: isPartner,
    },
  ];

  const onDetailsSubmit = async (values) => {
    const payload = {
      delivery_date: values.delivery_date
        ? dayjs(values.delivery_date).format("YYYY-MM-DD")
        : null,
      remarks: values.remarks,
      user_id: user.user_id,
    };

    try {
      await dispatch(saveOrderDetails({ id, data: payload })).unwrap();
      toast.success("Order details has been saved successfully");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getOrderDetails(id)).unwrap().catch(handleError);
  }, []);

  const calculateTotalPrice = () => {
    return orderDetails?.products
      ? orderDetails?.products
          .reduce((total, item) => {
            const price = parseFloat(item.price.replace("$", ""));
            return total + price * item.quantity;
          }, 0)
          .toFixed(2)
      : 0;
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>ORDER DETAILS</Title>
        <Breadcrumb
          items={[
            {
              title: "Order",
            },
            {
              title: "Order Details",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      {isItemLoading && (
        <div className="flex min-h-96 w-full items-center justify-center rounded-lg bg-white">
          <ThreeDots color="#ce0105" />
        </div>
      )}

      {!isItemLoading && orderDetails ? (
        <div className="min-h-96 rounded-lg bg-white p-6">
          <div className="flex justify-between pb-4">
            <div className="flex items-center gap-4">
              <Link to="/orders">
                <Tooltip title="Back to list">
                  <Button icon={<ArrowLeft size={16} />} />
                </Tooltip>
              </Link>
              <h4 className="text-base font-semibold">Billing Details</h4>
            </div>
            <p className="text-sm">
              Order No:{" "}
              <span className="text-gray-1 font-semibold">
                {orderDetails?.order_no}
              </span>
            </p>
          </div>
          <Descriptions items={items} />

          {orderDetails.status === "Cancelled" ? (
            <p className="rounded border bg-gray-50 p-4 text-sm font-semibold text-red-500">
              <span className="font-bold text-red-500">
                Cancellation Reason:
              </span>{" "}
              <span className="italic">{orderDetails.cancel_reason}</span>
            </p>
          ) : user.user_type === "Partner" ? (
            <Descriptions
              items={[
                {
                  key: "1",
                  label: "Delivery Date",
                  children: (
                    <p>
                      {orderDetails.delivery_date
                        ? dayjs(orderDetails.delivery_date).format("DD-MM-YYYY")
                        : null || "-"}
                    </p>
                  ),
                },
                {
                  key: "2",
                  label: "Remarks",
                  children: <p>{orderDetails.remarks || "-"}</p>,
                },
              ]}
            />
          ) : (
            <Form
              layout="vertical"
              autoComplete="off"
              className="mt-2"
              onFinish={onDetailsSubmit}
              initialValues={{
                remarks: orderDetails.remarks,
                delivery_date: orderDetails.delivery_date
                  ? dayjs(orderDetails.delivery_date)
                  : null,
              }}
            >
              <Row gutter={[16, 16]}>
                <Col span={24} sm={6}>
                  <Form.Item name="delivery_date" label="Delivery Date">
                    <DatePicker className="w-full" format="DD-MM-YYYY" />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12}>
                  <Form.Item name="remarks" label="Remarks">
                    <Input.TextArea rows={1} />
                  </Form.Item>
                </Col>
                <Col span={24} sm={6}>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="sm:mt-[29px]"
                    loading={isDetailsSubmitting}
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            </Form>
          )}

          <h4 className="mb-2 mt-4 text-base font-semibold">Products</h4>
          <Table
            columns={columns.filter((c) => !c.hide)}
            dataSource={orderDetails?.products || []}
            rowHoverable={false}
            size="middle"
            rowKey={"id"}
            pagination={false}
            scroll={{ y: 300, x: "calc(100% - 200px)" }}
          />

          {!isPartner && (
            <p className="mr-8 mt-4 text-end font-semibold">
              Total Price:{" "}
              <span className="font-bold">{calculateTotalPrice()}</span>
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ViewOrder;
