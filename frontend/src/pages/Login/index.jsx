import { Button, Form, Input } from "antd";
import { LockKeyhole, UserRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import useError from "../../hooks/useError.jsx";
import { loginHandler } from "../../store/features/authSlice.js";
import LoginBG from "../../assets/images/login-bg.jpg";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const handleError = useError();
  const { isLoggingIn } = useSelector((state) => state.auth);

  const onLogin = async (values) => {
    try {
      await dispatch(loginHandler(values)).unwrap();
      navigate(location.state?.prevUrl || "/");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#808080] bg-cover bg-center sm:justify-end sm:pr-16"
      style={{ backgroundImage: `url(${LoginBG})` }}
    >
      <div className="mx-4 w-full overflow-hidden rounded-lg bg-[#C0C0C0] shadow-lg sm:w-[450px] md:w-[450px]">
        <div className="flex h-28 items-center justify-center rounded-lg bg-white">
          <img src={Logo} alt="Pearson Logo" className="w-86 h-28" />
        </div>

        <div className="px-8 py-6">
          <div className="flex justify-center">
            <h1 className="text-3xl font-bold">Login</h1>
          </div>

          <p className="xs:text-[18px] mb-4 text-center text-[16px]">
            To begin a new session sign in
          </p>
          <Form
            name="login"
            autoComplete="off"
            layout="vertical"
            onFinish={onLogin}
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
              <Input
                placeholder="Email Address"
                size="large"
                autoFocus
                prefix={<UserRound size={18} className="text-gray-500" />}
                onFocus={() => window.scroll(0, 160)}
              />
            </Form.Item>

            <Form.Item
              className="mb-0 w-full"
              name="password"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Please enter your password!",
                },
              ]}
            >
              <Input.Password
                placeholder="Password"
                size="large"
                prefix={<LockKeyhole size={18} className="text-gray-500" />}
              />
            </Form.Item>

            <p className="mb-2 mt-1 text-black">
              <Link to="/email-verification" className="hover:text-gray-1">
                Forgot password?
              </Link>
            </p>

            <div className="flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                block
                className="!h-9 !w-[125px]"
                size="large"
                loading={isLoggingIn}
              >
                LOGIN
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
