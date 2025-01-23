import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
} from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setInitialFormData } from "../../../store/features/quoteSlice";
import AsyncSelect from "../../AsyncSelect";

const Step1Form = ({
  onSubmit,
  isFormSubmitting,
  initialValues = null,
  mode = "create",
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedRequestType } = useSelector((state) => state.quote);

  const isRotaryType = selectedRequestType === 2;

  const onFinish = (values) => {
    dispatch(setInitialFormData({ tab: "step1", data: values }));

    const payload = {
      ...values,
      country_id: values.country_id ? values.country_id.value : null,
      cow_standing_id: values.cow_standing_id
        ? values.cow_standing_id.value
        : null,
      type_of_cow_id: values.type_of_cow_id
        ? values.type_of_cow_id.value
        : null,
      delivery_id: values.delivery_id ? values.delivery_id.value : null,
      electricity_id: values.electricity_id
        ? values.electricity_id.value
        : null,
      installation_id: values.installation_id
        ? values.installation_id.value
        : null,
      parlour_style_id: values.parlour_style_id
        ? values.parlour_style_id.value
        : null,
      rotary_style_id: values.rotary_style_id
        ? values.rotary_style_id.value
        : null,
      document_date: values.document_date
        ? dayjs(values.document_date).format("YYYY-MM-DD")
        : null,
      est_delivery_date: values.est_delivery_date
        ? dayjs(values.est_delivery_date).format("YYYY-MM-DD")
        : null,
      request_type: selectedRequestType,
    };

    delete payload.document_no;

    onSubmit(payload);
  };

  return (
    <Form
      name="step1"
      layout="vertical"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        document_date: initialValues?.document_date || dayjs(),
        express_fit: initialValues?.express_fit || 0,
      }}
      scrollToFirstError={true}
    >
      <h2 className="text-lg font-medium">CUSTOMER DETAILS</h2>

      <Row gutter={12}>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="document_no" label="Document No:">
            <Input disabled placeholder="AUTO" />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item
            name="document_date"
            label="Document Date:"
            rules={[
              {
                required: mode !== "view",
                message: "Document Date is required!",
              },
            ]}
          >
            <DatePicker
              className="w-full"
              format="DD-MM-YYYY"
              disabled={mode === "view"}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="name" label="Name:">
            <Input disabled={mode === "view"} />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="house" label="House:">
            <Input disabled={mode === "view"} />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="road" label="Road:">
            <Input disabled={mode === "view"} />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="town" label="Town:">
            <Input disabled={mode === "view"} />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="county_id" label="County:">
            <Input disabled={mode === "view"} />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="country_id" label="Country:">
            <AsyncSelect
              endpoint="/lookups/country"
              labelInValue
              valueKey="id"
              labelKey="name"
              disabled={mode === "view"}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="postcode" label="Eircode / Postcode:">
            <Input disabled={mode === "view"} />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="phone_no" label="Tel Number:">
            <Input disabled={mode === "view"} />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item
            name="email"
            label="E-Mail:"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-Mail!",
              },
            ]}
          >
            <Input disabled={mode === "view"} />
          </Form.Item>
        </Col>
      </Row>

      <h2 className="text-lg font-medium">PARLOUR DETAILS</h2>

      <Row gutter={16}>
        <Col span={24} md={12} lg={8}>
          {isRotaryType ? (
            <Form.Item name="rotary_style_id" label="Rotary Style:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "55",
                }}
              />
            </Form.Item>
          ) : (
            <Form.Item name="parlour_style_id" label="Parlour Style:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "1",
                }}
              />
            </Form.Item>
          )}
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item
            name="no_of_milking_units"
            label="No. of Milking Units:"
            rules={[
              () => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();
                  if (
                    isNaN(value) ||
                    value < (isRotaryType ? 24 : 4) ||
                    value > 100
                  ) {
                    return Promise.reject(
                      new Error(
                        `Enter number between ${isRotaryType ? 24 : 4} and 100`,
                      ),
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              className="w-full"
              placeholder={`Between ${isRotaryType ? 24 : 4} and 100`}
              disabled={mode === "view"}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item
            name="no_of_cow_stalls"
            label="No. of Cow Stalls:"
            rules={[
              () => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();
                  if (
                    isNaN(value) ||
                    value < (isRotaryType ? 24 : 4) ||
                    value > 100
                  ) {
                    return Promise.reject(
                      new Error(
                        `Enter number between ${isRotaryType ? 24 : 4} and 100`,
                      ),
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              placeholder={`Between ${isRotaryType ? 24 : 4} and 100`}
              disabled={mode === "view"}
            />
          </Form.Item>
        </Col>
        {!isRotaryType && (
          <Col span={24} md={12} lg={8}>
            <Form.Item name="cow_standing_id" label="Cow Standing:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "2",
                }}
              />
            </Form.Item>
          </Col>
        )}
        <Col span={24} md={12} lg={8}>
          <Form.Item name="type_of_cow_id" label="Type of Cows:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "3",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item
            name="no_of_cows"
            label="No. of Cows:"
            rules={[
              () => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();
                  if (isNaN(value) || value < 0 || !Number.isInteger(+value)) {
                    return Promise.reject(
                      new Error("Please enter a number without decimal"),
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input disabled={mode === "view"} />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="electricity_id" label="Electricity:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "4",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="express_fit" label="Express fit:">
            <Select
              showSearch
              optionFilterProp="label"
              options={[
                { value: 1, label: "Yes" },
                { value: 0, label: "No" },
              ]}
              disabled={mode === "view"}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="installation_id" label="Installation:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "5",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="delivery_id" label="Delivery:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "6",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="est_delivery_date" label="Est Delivery Date:">
            <DatePicker
              format="DD-MM-YYYY"
              className="w-full"
              disabled={mode === "view"}
            />
          </Form.Item>
        </Col>
      </Row>

      <div className="flex justify-end gap-2">
        {mode === "view" ? (
          <Button type="default" onClick={() => navigate("/quote")}>
            Cancel
          </Button>
        ) : (
          <Popconfirm
            title="Are you sure?"
            description="Are you sure to cancel, all changes will be lost?"
            cancelText="No"
            okText="Yes"
            onConfirm={() => navigate("/quote")}
          >
            <Button type="default">Cancel</Button>
          </Popconfirm>
        )}
        <Button
          type="primary"
          loading={isFormSubmitting}
          onClick={() => form.submit()}
        >
          Next
        </Button>
      </div>
    </Form>
  );
};

export default Step1Form;
