import { Button, Form, Input } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AttributeForm = ({ mode = "create", onSubmit }) => {
  const { isFormSubmitting, initialFormValues } = useSelector(
    (state) => state.attribute,
  );

  const onFinish = (formValues) => {
    onSubmit(formValues);
  };

  return (
    <Form
      name="attribute"
      onFinish={onFinish}
      autoComplete="off"
      layout="vertical"
      initialValues={mode === "edit" ? initialFormValues : null}
    >
      <Form.Item
        label="Attribute Name"
        name="name"
        rules={[{ required: true, message: "Please enter attribute name" }]}
      >
        <Input autoFocus />
      </Form.Item>
      <div className="mt-4 flex justify-end gap-2">
        <Link to="/attribute" className="w-20">
          <Button htmlType="button" block>
            Cancel
          </Button>
        </Link>
        <Button
          type="primary"
          htmlType="submit"
          className="w-20"
          loading={isFormSubmitting}
        >
          Save
        </Button>
      </div>
    </Form>
  );
};
export default AttributeForm;
