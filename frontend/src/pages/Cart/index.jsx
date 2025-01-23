import {
  Breadcrumb,
  Button,
  Image,
  Input,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { ChevronsRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImagePlaceholder from "../../assets/images/img-placeholder.png";
import { API_URL } from "../../axiosInstance";
import useError from "../../hooks/useError";
import {
  changeQuantity,
  deleteCartItem,
  getCartList,
  updateListItemQuantity,
} from "../../store/features/cartSlice";
import { getNotificationList } from "../../store/features/notificationsSlice";

const { Title } = Typography;

const Cart = () => {
  const handleError = useError();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list, isLoading } = useSelector((state) => state.cart);

  const handleQuantityChange = async (id, change) => {
    try {
      await dispatch(
        changeQuantity({ id, user_id: user.user_id, quantity: change }),
      ).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onCartItemDelete = async (id) => {
    try {
      await dispatch(deleteCartItem({ id, user_id: user.user_id })).unwrap();
      await dispatch(
        getNotificationList({
          user_id: user?.user_id,
          user_type: user.user_type,
        }),
      ).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      width: 120,
      render: (_, { image_url }) => (
        <div className="h-16 w-16 overflow-hidden rounded-md">
          <Image
            className="h-full w-full"
            title="image"
            src={`${API_URL}/public/${image_url}`}
            fallback={ImagePlaceholder}
          />
        </div>
      ),
    },
    {
      title: "Product Name",
      dataIndex: "name",
      width: 200,
      render: (_, { product_id, name }) => (
        <Link to={`/shop/${product_id}`}>
          <p className="text-black hover:text-gray-600 hover:underline">
            {name}
          </p>
        </Link>
      ),
    },
    {
      title: "Part No",
      dataIndex: "part_number",
      width: 100,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: 180,
      render: (_, { id, quantity }) => (
        <Space>
          <Button
            onClick={() => handleQuantityChange(id, quantity - 1)}
            disabled={quantity <= 1}
            icon={<Minus size={12} />}
          />
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              dispatch(updateListItemQuantity({ id, quantity: e.target.value }))
            }
            onBlur={(e) => handleQuantityChange(id, e.target.value)}
            style={{ width: 60, textAlign: "center" }}
          />
          <Button
            onClick={() => handleQuantityChange(id, +quantity + 1)}
            icon={<Plus size={12} />}
          />
        </Space>
      ),
    },
    {
      dataIndex: "actions",
      width: 60,
      align: "right",
      render: (_, { id }) => (
        <Popconfirm
          title="Are you sure?"
          onConfirm={() => onCartItemDelete(id)}
          okText="Yes"
          cancelText="No"
        >
          <Tooltip title="Delete" placement="leftBottom">
            <Button icon={<Trash2 size={18} />} type="primary" danger />
          </Tooltip>
        </Popconfirm>
      ),
    },
  ];

  useEffect(() => {
    dispatch(
      getCartList({
        user_id: user.user_id,
      }),
    )
      .unwrap()
      .catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>CART</Title>
        <Breadcrumb
          items={[
            {
              title: "Cart",
            },
            {
              title: "List",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="min-h-96 rounded-lg bg-white p-4">
        <Table
          columns={columns}
          dataSource={list}
          rowHoverable={false}
          size="middle"
          rowKey={"id"}
          pagination={false}
          loading={isLoading}
          scroll={{ y: 300, x: "calc(100% - 200px)" }}
        />
        <div className="mt-4 flex items-center justify-end gap-2">
          <Link to="/shop">
            <Button size="large">Back to Shop</Button>
          </Link>
          <Link to="/checkout">
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCart size={22} />}
              disabled={list.length === 0}
            >
              Checkout
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Cart;
