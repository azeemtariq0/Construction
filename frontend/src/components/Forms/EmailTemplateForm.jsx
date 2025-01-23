import { Button, Card, Form, Input, Spin, Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AsyncSelectNoPaginate from "../AsyncSelect/AsyncSelectNoPaginate";
import useError from "../../hooks/useError";
import { getEmailTags } from "../../store/features/emailTemplateSlice";

const TAGS = [
  "<Link>",
  "<Email>",
  "<Password>",
  "<Reset Password>",
  "<Request ID>",
  "<Order ID>",
  "<Remarks>",
  "<Table Order>",
  "<Order Date>",
];
const EmailTemplateForm = ({ mode = "create", onSubmit }) => {
  const handleError = useError();
  const dispatch = useDispatch();

  const { isFormSubmitting, initialFormValues, isTagsLoading, tags } =
    useSelector((state) => state.emailTemplate);
  const [description, setDescription] = useState(
    mode === "edit" ? initialFormValues.description : "",
  );
  const copyTag = (tag) => navigator.clipboard.writeText(tag);

  const onFinish = (values) => {
    onSubmit({
      module: values.module,
      details: [
        { field: "subject", value: values.subject },
        { field: "description", value: description },
      ],
    });
  };

  const onModuleChange = async (value) => {
    const module = value.split(" ").join("-");

    try {
      await dispatch(getEmailTags(module)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (mode === "edit") {
      onModuleChange(initialFormValues.module);
    }
  }, []);

  return (
    <Form
      autoComplete="off"
      layout="vertical"
      onFinish={onFinish}
      initialValues={mode === "edit" ? initialFormValues : null}
    >
      <Form.Item
        name="module"
        label="Module"
        className="w-full sm:w-2/4 sm:pr-2"
        rules={[{ required: true }]}
      >
        <AsyncSelectNoPaginate
          endpoint="/lookups/template-modules"
          onChange={(value) => onModuleChange(value)}
        />
      </Form.Item>

      <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row">
        <div className="w-full">
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, whitespace: true }]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>
          <p className="mb-2 text-[15px]">Description</p>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            readOnly={mode === "view"}
            modules={{
              toolbar: [
                ["bold", "italic", "underline", "strike"],
                [{ size: ["small", false, "large", "huge"] }],
                [{ align: [false, "center", "right"] }],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ script: "sub" }, { script: "super" }],
                ["clean"],
              ],
            }}
          />
        </div>
        <Card
          title={
            <div>
              <span>Tags</span>
              <span className="ml-1 text-xs font-normal text-red-500">
                (Tags are case-sensitive, Please use them accordingly).
              </span>
            </div>
          }
          className="w-full"
          size="small"
        >
          {isTagsLoading && (
            <div className="flex h-20 items-center justify-center">
              <Spin />
            </div>
          )}

          {!isTagsLoading && tags.length > 0
            ? tags.map((tag) => {
                return (
                  <Tooltip title="Copy" key={tag}>
                    <Tag
                      className="mb-2 cursor-pointer"
                      onClick={() => copyTag(tag)}
                    >
                      {tag}
                    </Tag>
                  </Tooltip>
                );
              })
            : null}
        </Card>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Link to="/email-template">
          <Button>Cancel</Button>
        </Link>
        <Button type="primary" htmlType="submit" loading={isFormSubmitting}>
          Save
        </Button>
      </div>
    </Form>
  );
};
export default EmailTemplateForm;
