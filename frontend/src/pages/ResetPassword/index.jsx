import { Button, Form, Input } from "antd";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import useError from "../../hooks/useError.jsx";
import { resetPassword } from "../../store/features/authSlice.js";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleError = useError();
  let [searchParams, setSearchParams] = useSearchParams();
  const user_id = searchParams.get("id");

  const { isPasswordResetting } = useSelector((state) => state.auth);

  const onReset = async (values) => {
    try {
      await dispatch(resetPassword({ user_id, ...values })).unwrap();
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#808080]">
      <div className="mx-4 w-full overflow-hidden rounded-lg bg-[#C0C0C0] shadow-lg sm:w-[450px] md:w-[450px]">
        <div className="px-8 py-6">
          <div className="mb-4 flex justify-center">
            <h1 className="text-3xl font-bold">Reset Password</h1>
          </div>

          <Form
            name="reset-password"
            autoComplete="off"
            layout="vertical"
            onFinish={onReset}
          >
            <Form.Item
              className="w-full"
              name="new_password"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please input your new password!",
                },
                {
                  min: 8,
                  message: "Password must be at least 8 characters!",
                },
                {
                  pattern: /(?=.*[a-z])/,
                  message: "Password must contain lowercase letter!",
                },
                {
                  pattern: /(?=.*[A-Z])/,
                  message: "Password must contain uppercase letter!",
                },
                {
                  pattern: /(?=.*[!@#$%^&*])/,
                  message: "Password must contain special character!",
                },
                {
                  pattern: /(?=.*[0-9])/,
                  message: "Password must contain a number!",
                },
              ]}
              validateFirst
            >
              <Input.Password
                placeholder="New Password"
                size="large"
                autoFocus
              />
            </Form.Item>

            <Form.Item
              className="w-full"
              name="confirm_password"
              dependencies={["new_password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("new_password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!"),
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" size="large" />
            </Form.Item>

            <div className="flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                block
                className="!h-9 !w-[125px]"
                size="large"
                loading={isPasswordResetting}
              >
                RESET
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
