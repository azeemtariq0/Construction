import { Button, Form, Input, Modal } from "antd";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useError from "../../hooks/useError";
import { updatePasswordHandler } from "../../store/features/authSlice";

const UpdatePasswordModal = ({
  open,
  closable = false,
  onClose = () => {},
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const handleError = useError();
  const { user, isPasswordUpdating } = useSelector((state) => state.auth);

  const onFinish = async (values) => {
    const payload = {
      user_id: user.user_id,
      password: values.old_password,
      new_password: values.new_password,
      confirm_password: values.confirm_new_password,
    };

    try {
      await dispatch(updatePasswordHandler(payload)).unwrap();
      toast.success("Password updated successfully");
      onClose();
      form.resetFields();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Modal
      open={open}
      title="Change Password"
      footer={null}
      closable={closable}
      onCancel={onClose}
    >
      <Form
        name="updatePassword"
        layout="vertical"
        onFinish={onFinish}
        form={form}
      >
        <Form.Item
          name="old_password"
          label="Old Password"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Please enter your old password",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="new_password"
          label="New Password"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Please enter your new password",
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
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value && getFieldValue("old_password") === value) {
                  return Promise.reject(
                    new Error(
                      "New password cannot be the same as old password!",
                    ),
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
          validateFirst
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm_new_password"
          label="Confirm New Password"
          dependencies={["new_password"]}
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Please enter your confirm password",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value && value !== getFieldValue("new_password")) {
                  return Promise.reject(
                    new Error("Confirm password does not match new password!"),
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <div className="flex justify-end gap-4">
          {closable && (
            <Button
              className="px-6"
              onClick={() => {
                onClose();
                form.resetFields();
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="primary"
            htmlType="submit"
            className="px-6"
            loading={isPasswordUpdating}
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdatePasswordModal;
