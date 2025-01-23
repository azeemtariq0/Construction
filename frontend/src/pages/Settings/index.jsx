import {
  Checkbox as AntCheck,
  Button,
  Col,
  Form,
  Input,
  Radio,
  Row,
} from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import useError from "../../hooks/useError";
import {
  debugEmail,
  getSettings,
  updateSettings,
} from "../../store/features/settingsSlice";

// eslint-disable-next-line react/prop-types
const CheckBox = ({ children, checked, onChange }) => {
  return (
    <label className="flex w-full cursor-pointer items-center gap-2 rounded-md border border-gray-300 p-2 hover:bg-slate-50">
      <AntCheck checked={checked} onChange={onChange} />
      <div className="text-red-1 text-base font-semibold">{children}</div>
    </label>
  );
};

const Settings = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const handleError = useError();
  const { isSettingGetting, isSettingUpdating, initialValues } = useSelector(
    (state) => state.settings,
  );
  const [isDebug, setIsDebug] = useState(false);

  const onFinish = async (values) => {
    const payload = {
      general: {
        ...initialValues,
        ...values,
        mail_type: "smtp",
        debug: isDebug ? 1 : 0,
      },
    };

    try {
      await dispatch(updateSettings(payload)).unwrap();
      toast.success("Settings updated successfully");
    } catch (error) {
      handleError(error);
    }
  };

  const onDebugEmail = async () => {
    try {
      await dispatch(debugEmail()).unwrap();
      toast.success("Email sent successfully");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getSettings())
      .unwrap()
      .then((data) => {
        setIsDebug(data?.debug == "1" || false);
      })
      .catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Title level={4}>Settings</Title>
      {isSettingGetting ? (
        <div className="flex min-h-80 w-full items-center justify-center rounded-lg bg-white md:w-3/5">
          <ThreeDots color="#ce0105" />
        </div>
      ) : (
        <div className="w-full rounded-lg bg-white p-4 md:w-3/5">
          <Form
            name="settings"
            layout="vertical"
            autoComplete="off"
            form={form}
            initialValues={initialValues}
            onFinish={onFinish}
          >
            <Row gutter={[16, 10]}>
              <Col span={24} sm={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      type: "email",
                      message: "Please enter a valid email!",
                    },
                  ]}
                >
                  <Input autoFocus />
                </Form.Item>
              </Col>
              <Col span={24} sm={12}>
                <Form.Item name="display_name" label="Display Name">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={24} sm={12}>
                <Form.Item name="smtp_host" label="Host">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24} sm={12}>
                <Form.Item name="smtp_user" label="User">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24} sm={12}>
                <Form.Item name="smtp_password" label="Password">
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col span={24} sm={12}>
                <Form.Item name="smtp_port" label="Port">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="smtp_encryption" label="Encryption">
                  <Radio.Group>
                    <Radio value="ssl">SSL</Radio>
                    <Radio value="tls">TLS</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 10]} className="mb-4">
              <Col span={24} sm={12} className="mt-[22px]">
                <CheckBox
                  checked={isDebug}
                  onChange={() => setIsDebug((prev) => !prev)}
                >
                  Debug
                </CheckBox>
              </Col>
              {isDebug && (
                <Col span={24} sm={12}>
                  <Form.Item
                    name="debug_email"
                    label="Debug Email"
                    className="m-0"
                  >
                    <Input />
                  </Form.Item>
                  <p
                    className="text-red-1 cursor-pointer py-[2px] text-end text-sm hover:underline"
                    onClick={onDebugEmail}
                  >
                    Send Email
                  </p>
                </Col>
              )}
            </Row>

            <div className="flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                className="w-28"
                loading={isSettingUpdating}
              >
                Save
              </Button>
            </div>
          </Form>
        </div>
      )}
    </>
  );
};

export default Settings;
