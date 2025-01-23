import {
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Typography,
} from "antd";
import {
  BadgeCheck,
  ChevronsRight,
  ReceiptText,
  ShoppingBasket,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ImagePlaceholder from "../../assets/images/img-placeholder.png";
import { API_URL } from "../../axiosInstance";
import AsyncSelect from "../../components/AsyncSelect";
import useError from "../../hooks/useError";
import { getCartList } from "../../store/features/cartSlice";
import { checkout } from "../../store/features/checkoutSlice";
const { Title } = Typography;

const ProductItem = ({
  name,
  price,
  quantity,
  image,
  partNo,
  isLast = false,
}) => {
  return (
    <div
      className={`flex items-center gap-4 ${!isLast ? "border-b" : ""} p-1 px-2`}
    >
      <div>
        <div className="h-12 w-12 overflow-hidden rounded-full">
          <Image
            src={`${API_URL}/public/${image}`}
            alt={name}
            fallback={ImagePlaceholder}
          />
        </div>
      </div>

      <div className="w-full">
        <p className="text-sm font-semibold">{name}</p>
        <span className="text-gray-400">
          {partNo} X {quantity}
        </span>
      </div>
    </div>
  );
};

const Checkout = () => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isOrderSuccessModalOpen, setOrderSuccessModalOpen] = useState(false);
  const [isAgree, setIsAgree] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleError = useError();
  const { user } = useSelector((state) => state.auth);
  const { list, isLoading } = useSelector((state) => state.cart);
  const { isSubmitting } = useSelector((state) => state.checkout);

  const [formData, setFormData] = useState(null);

  const toggleConfirmationModal = () => {
    setIsConfirmationModalOpen((prev) => !prev);
  };

  const toggleOrderSuccessModal = () => {
    setOrderSuccessModalOpen((prev) => !prev);
  };

  const handleCheckout = async () => {
    try {
      await dispatch(checkout(formData)).unwrap();
      toggleConfirmationModal();
      toggleOrderSuccessModal();
    } catch (error) {
      handleError(error);
    }
  };

  const totalPrice = list
    .reduce((total, item) => {
      const price = parseFloat(item.price.replace("$", ""));
      return total + price * item.quantity;
    }, 0)
    .toFixed(2);

  useEffect(() => {
    if (!list.length) {
      dispatch(
        getCartList({
          user_id: user.user_id,
        }),
      )
        .unwrap()
        .then((data) => {
          !data.length && navigate("/shop");
        })
        .catch(handleError);
    }
  }, []);

  const [firstName, ...lastName] = user.name.split(" ");
  const initialFormValues = {
    first_name: firstName,
    last_name: lastName.join(" "),
    organization: user.organization,
    country_id: {
      value: user.country_id,
      label: user.country_name,
    },
    phone_no: user.phone_no,
    postal_code: user.postal_code,
    address: user.address,
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>CHECKOUT</Title>
        <Breadcrumb
          items={[
            {
              title: "Cart",
            },
            {
              title: "Checkout",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full rounded-lg bg-white p-4">
          <h5 className="mb-2 text-lg font-semibold">Billing Details</h5>

          <Form
            name="checkout"
            autoComplete="off"
            layout="vertical"
            onFinish={(values) => {
              setFormData({
                ...values,
                country_id: values.country_id.value,
                total_amount: totalPrice,
                user_id: user.user_id,
              });
              toggleConfirmationModal();
            }}
            initialValues={initialFormValues}
          >
            <Row gutter={16}>
              <Col span={24} sm={12}>
                <Form.Item
                  name="first_name"
                  label="First Name"
                  rules={[{ required: true }]}
                >
                  <Input autoFocus />
                </Form.Item>
              </Col>
              <Col span={24} sm={12}>
                <Form.Item name="last_name" label="Last Name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24} sm={12}>
                <Form.Item
                  name="organization"
                  label="Organization"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24} sm={12}>
                <Form.Item
                  name="country_id"
                  label="Country"
                  rules={[{ required: true }]}
                >
                  <AsyncSelect
                    endpoint="/lookups/country"
                    valueKey="id"
                    labelKey="name"
                    labelInValue
                  />
                </Form.Item>
              </Col>
              <Col span={24} sm={12}>
                <Form.Item
                  name="phone_no"
                  label="Phone Number"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24} sm={12}>
                <Form.Item
                  name="postal_code"
                  label="Post Code"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea rows={1} />
                </Form.Item>
              </Col>
            </Row>

            <div className="flex justify-end gap-4">
              <Link to="/cart">
                <Button>Back to Cart</Button>
              </Link>
              <Button
                type="primary"
                icon={<ReceiptText size={16} />}
                htmlType="submit"
              >
                Place Order
              </Button>
            </div>
          </Form>
        </div>

        <div className="order-first w-full min-w-64 rounded-lg bg-white md:order-last md:min-h-96 md:w-[40%]">
          {isLoading && (
            <div className="flex h-full w-full items-center justify-center">
              <ThreeDots color="#ce0105" />
            </div>
          )}
          <div className="max-h-[450px] overflow-y-auto">
            {list.map((item, index) => (
              <ProductItem
                key={item.id}
                name={item.name}
                price={item.price}
                partNo={item.part_number}
                quantity={item.quantity}
                image={item.image_url}
                isLast={index === list.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      <Modal
        title={
          <div className="flex w-full justify-center gap-2">
            <p className="text-red-1 mb-4 text-lg font-semibold">
              Please confirm your order
            </p>
            <ShoppingBasket size={24} className="text-red-1" />{" "}
          </div>
        }
        open={isConfirmationModalOpen}
        onOk={handleCheckout}
        onCancel={toggleConfirmationModal}
        centered
        closeIcon={null}
        okText="Confirm"
        confirmLoading={isSubmitting}
        okButtonProps={{ disabled: !isAgree }}
        classNames={{
          content: "!px-2 !py-3",
        }}
        width={450}
      >
        <div className="max-h-60 overflow-y-auto rounded-md border border-gray-300">
          {list.map((item, index) => (
            <ProductItem
              key={item.id}
              name={item.name}
              price={item.price}
              partNo={item.part_number}
              quantity={item.quantity}
              image={item.image_url}
              isLast={index === list.length - 1}
            />
          ))}
        </div>

        <p className="mt-4 px-4 pb-4 text-sm">
          <span className="font-semibold text-gray-600">Address:</span>{" "}
          {formData?.address}
        </p>

        {/* Privacy Policy Link */}
        <p className="mb-4 mt-2 px-4">
          <label>
            <Checkbox
              checked={isAgree}
              onChange={() => setIsAgree((pre) => !pre)}
            />{" "}
            I have read and agree to the
          </label>
          <Link
            to="/privacy-policy.html"
            target="_blank"
            className="text-red-1 hover:text-red-1 ml-1 hover:underline"
          >
            Privacy Policy{" "}
          </Link>
        </p>
      </Modal>

      <Modal
        open={isOrderSuccessModalOpen}
        onOk={toggleOrderSuccessModal}
        centered
        closeIcon={null}
        footer={null}
        closable={false}
        classNames={{
          content: "!py-8",
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <BadgeCheck size={120} className="text-green-500" />

          <h5 className="mt-4 text-xl">Thank you for your order.</h5>
          <p className="my-2 text-center text-base text-gray-500 sm:px-12">
            Your order has been placed. You will receive an email shortly.
          </p>

          <div className="flex gap-4">
            <Link to="/">
              <Button className="w- mt-4">Back to Home</Button>
            </Link>
            <Link to="/orders">
              <Button type="primary" className="w- mt-4">
                Orders History
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Checkout;
