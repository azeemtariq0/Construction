import {
  Button,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  Row,
  TimePicker,
  Upload,
} from "antd";
import dayjs from "dayjs";
import { ImageIcon } from "lucide-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setProductFormValues } from "../../store/features/productSlice";
import AsyncSelect from "../AsyncSelect";
import ChipInput from "../Input/ChipInput";
import StatusSelect from "../Select/StatusSelect";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ProductForm = ({ mode = "create", onSubmit }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const { isFormSubmitting, initialFormValues } = useSelector(
    (state) => state.product,
  );
  const [fileList, setFileList] = useState(initialFormValues?.images || []);
  const [tags, setTags] = useState(initialFormValues?.tags || []);
  const [deletedImages, setDeletedImages] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const [productDetails, setProductDetails] = useState(
    initialFormValues?.productDetails || "",
  );

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = async () => {
    try {
      await form.validateFields();
    } catch (error) {
      return;
    }

    const formValues = form.getFieldsValue();
    const images = fileList.map((item) => item.thumbUrl || item.name);
    const payload = {
      name: formValues.name,
      product_category_id: formValues.category?.value,
      summary: formValues.summary,
      label_tags: tags.length > 0 ? tags.join("_") : null,
      description: productDetails,
      status: formValues.status,
      schedule_date: formValues.date
        ? dayjs(formValues.date).format("YYYY-MM-DD")
        : null,
      schedule_time: formValues.time
        ? dayjs(formValues.time).format("HH:mm")
        : null,
      user_id: user.user_id,
      images,
      deleted_images: deletedImages,
      attributes: formValues.attributes.map((item) => ({
        attribute_id: item.value,
        attribute_name: item.label,
      })),
      tab_no: 1,
    };

    dispatch(
      setProductFormValues({
        ...formValues,
        images: fileList,
        tags,
        productDetails,
      }),
    );

    onSubmit(payload);
  };

  const onPreview = async () => {
    try {
      await form.validateFields();
    } catch (error) {
      return;
    }

    const formValues = form.getFieldsValue();

    dispatch(
      setProductFormValues({
        ...formValues,
        images: fileList,
        tags,
        productDetails,
      }),
    );

    navigate("/product/preview");
    window.scroll(0, 0);
  };

  return (
    <Form
      name="product"
      autoComplete="off"
      layout="vertical"
      form={form}
      className="p-4 pb-4 pt-0"
      initialValues={
        initialFormValues || {
          status: 0,
        }
      }
    >
      <Row gutter={[25, 25]}>
        <Col span={24} md={16}>
          <div className="h-full rounded-xl border border-gray-300 shadow-sm">
            <div className="border-b border-gray-300 p-4 font-semibold">
              Product Information
            </div>
            <div className="p-5">
              <Row gutter={[16, 16]}>
                <Col span={24} md={12}>
                  <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[{ required: true }]}
                  >
                    <Input autoFocus disabled={mode === "view"} />
                  </Form.Item>
                </Col>
                <Col span={24} md={12}>
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true }]}
                  >
                    <AsyncSelect
                      disabled={mode === "view"}
                      endpoint="/product-category"
                      valueKey="id"
                      labelKey="name"
                      labelInValue
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="summary"
                label="Summary"
                rules={[{ required: true, whitespace: true }, { max: 100 }]}
              >
                <Input disabled={mode === "view"} />
              </Form.Item>
              <p className="mb-2 text-[15px]">Details</p>
              <ReactQuill
                theme="snow"
                value={productDetails}
                onChange={setProductDetails}
                readOnly={mode === "view"}
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline", "strike"],
                    [{ size: ["small", false, "large", "huge"] }],
                    [{ align: [false, "center", "right"] }],
                    ["blockquote", "code-block", "link"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ script: "sub" }, { script: "super" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ color: [] }, { background: [] }],
                    ["clean"],
                  ],
                }}
                className="md:h-52"
              />
            </div>
          </div>
        </Col>
        <Col span={24} md={8}>
          <div className="rounded-xl border border-gray-300 shadow-sm">
            <div className="border-b border-gray-300 p-4 font-semibold">
              Schedule
            </div>

            <div className="p-5">
              <Form.Item name="date" label="Date">
                <DatePicker
                  format="DD-MM-YYYY"
                  placeholder=""
                  disabled={mode === "view"}
                  className="w-full"
                />
              </Form.Item>
              <Form.Item name="time" label="Time">
                <TimePicker
                  format="HH:mm"
                  placeholder=""
                  disabled={mode === "view"}
                  needConfirm={false}
                  className="w-full"
                />
              </Form.Item>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-gray-300 p-5 shadow-sm">
            <p className="mb-2 text-[15px]">Tags</p>
            <ChipInput
              value={tags}
              onChange={setTags}
              className="pb-4"
              disabled={mode === "view"}
            />
            <Form.Item name="status" label="Status">
              <StatusSelect disabled={mode === "view"} />
            </Form.Item>
            <Form.Item
              name="attributes"
              label="Attributes"
              rules={[{ required: true }]}
            >
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/attribute"
                valueKey="id"
                mode="multiple"
                labelKey="name"
                labelInValue
              />
            </Form.Item>
          </div>
        </Col>
      </Row>

      <div className="mt-4 rounded-xl border border-gray-300 shadow-sm">
        <div className="border-b border-gray-300 p-4 font-semibold">Images</div>
        <div className="p-4">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false}
            onPreview={handlePreview}
            onChange={handleChange}
            accept="image/*"
            multiple
            onRemove={(e) => {
              if (!e.thumbUrl) {
                setDeletedImages((prevImages) => [...prevImages, e.name]);
              }
            }}
            disabled={mode === "view"}
          >
            <ImageIcon size={40} className="text-gray-500" />
          </Upload>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-4">
        <Link to="/product" className="w-28">
          <Button htmlType="button" block>
            Cancel
          </Button>
        </Link>
        <Button
          type="primary"
          className="!bg-gray-1 w-28 !text-white"
          onClick={onPreview}
        >
          Preview
        </Button>
        {mode !== "view" && (
          <Button
            type="primary"
            className="w-28"
            onClick={onFinish}
            loading={isFormSubmitting}
          >
            Next
          </Button>
        )}
      </div>

      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </Form>
  );
};
export default ProductForm;
