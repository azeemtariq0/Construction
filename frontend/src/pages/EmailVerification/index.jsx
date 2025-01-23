import { Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import useError from "../../hooks/useError.jsx";
import { verifyEmail } from "../../store/features/authSlice.js";

const EmailVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleError = useError();
  let [searchParams, setSearchParams] = useSearchParams();
  const email = searchParams.get("email");

  const { isEmailVerifying } = useSelector((state) => state.auth);

  const onVerify = async ({ email }) => {
    try {
      await dispatch(verifyEmail({ email })).unwrap();
      navigate(`/verification-message/${email}`);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#808080]">
      <div className="mx-4 w-full overflow-hidden rounded-lg bg-[#C0C0C0] shadow-lg sm:w-[450px] md:w-[450px]">
        <div className="px-8 py-4">
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold">Email Verification</h1>
          </div>

          <p className="mb-4 text-center text-[14px]">
            Please check your email for a verification message. If you need to
            reset your password, click the link provided in the email
          </p>

          <Form
            name="login"
            autoComplete="off"
            layout="vertical"
            onFinish={onVerify}
            initialValues={{ email }}
          >
            <Form.Item
              className="w-full"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email!",
                },
              ]}
            >
              <Input placeholder="Enter email address" size="large" autoFocus />
            </Form.Item>

            <div className="flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                block
                className="!h-9 !w-[125px]"
                size="large"
                loading={isEmailVerifying}
              >
                VERIFY
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
