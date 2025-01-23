import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Popconfirm,
  Radio,
  Row,
  Select,
} from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setInitialFormData } from "../../../store/features/quoteSlice";
import AsyncSelect from "../../AsyncSelect";

const Step8Form = ({
  onSubmit,
  onBack,
  isFormSubmitting,
  mode = "create",
  initialValues = null,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedRequestType } = useSelector((state) => state.quote);
  const isRotaryType = selectedRequestType === 2;

  const onFinish = (values) => {
    dispatch(setInitialFormData({ tab: "step8", data: values }));
    const payload = {
      ...values,
      feed_type_id: values.feed_type_id ? values.feed_type_id.value : null,
      feed_control_id: values.feed_control_id
        ? values.feed_control_id.value
        : null,
      feeding_trough_id: values.feeding_trough_id
        ? values.feeding_trough_id.value
        : null,
      feed_unit_id: values.feed_unit_id ? values.feed_unit_id.value : null,
      in_parlour_feed_control_id: values.in_parlour_feed_control_id
        ? values.in_parlour_feed_control_id.value
        : null,
      feed_stations: [
        values.single_feed_station,
        values.double_feed_station,
        values.quad_feed_station,
      ],
      feed_type: [
        values.single_feed_type,
        values.double_feed_type,
        values.quad_feed_type,
      ],
      anti_bully_bars: [
        values.single_anti_bully ? "1" : "0",
        values.double_anti_bully ? "1" : "0",
        values.quad_anti_bully ? "1" : "0",
      ],
      request_type: selectedRequestType,
    };

    onSubmit(payload);
  };

  return (
    <Form
      name="step8"
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
      form={form}
      initialValues={{
        ...initialValues,
        feed_system_protection_rails:
          initialValues?.feed_system_protection_rails || 0,
        flex_auger_system: initialValues?.flex_auger_system || 0,
        drop_box_assembly: initialValues?.drop_box_assembly || 0,
        feed_hopper: initialValues?.feed_hopper || 0,
        extra_long_auger: initialValues?.extra_long_auger || 0,
      }}
      scrollToFirstError={true}
    >
      <h2 className="text-lg font-medium">IN PARLOUR FEEDING</h2>

      {isRotaryType ? (
        <Row gutter={12}>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="feed_hopper" label="Feed Hopper:">
              <Select
                disabled={mode === "view"}
                showSearch
                optionFilterProp="label"
                options={[
                  {
                    value: 1,
                    label: "Yes",
                  },
                  {
                    value: 0,
                    label: "No",
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="feed_type_id" label="Feed Types:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "69",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="feed_control_id" label="Feed Control:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "70",
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      ) : (
        <Row gutter={12}>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="feed_unit_id" label="Feed Units:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "47",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name="feed_system_protection_rails"
              label="Feed System Protection Rails:"
            >
              <Select
                disabled={mode === "view"}
                showSearch
                optionFilterProp="label"
                options={[
                  {
                    value: 1,
                    label: "Yes",
                  },
                  {
                    value: 0,
                    label: "No",
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name="in_parlour_feed_control_id"
              label="In Parlour Feed Control:"
            >
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "48",
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      )}

      <h2 className="text-lg font-medium">IN PARLOUR AUGER SYSTEM</h2>

      <Row gutter={12}>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="flex_auger_system" label="Flex Auger System:">
            <Select
              disabled={mode === "view"}
              showSearch
              optionFilterProp="label"
              options={[
                {
                  value: 1,
                  label: "Yes",
                },
                {
                  value: 0,
                  label: "No",
                },
              ]}
            />
          </Form.Item>
        </Col>
        {!isRotaryType && (
          <Col span={24} md={12} lg={8}>
            <Form.Item name="drop_box_assembly" label="Drop Box Assembly:">
              <Select
                disabled={mode === "view"}
                showSearch
                optionFilterProp="label"
                options={[
                  {
                    value: 1,
                    label: "Yes",
                  },
                  {
                    value: 0,
                    label: "No",
                  },
                ]}
              />
            </Form.Item>
          </Col>
        )}

        {isRotaryType && (
          <Col span={24} md={12} lg={8}>
            <Form.Item name="extra_long_auger" label="Extra Long Auger:">
              <Select
                disabled={mode === "view"}
                showSearch
                optionFilterProp="label"
                options={[
                  {
                    value: 1,
                    label: "Yes",
                  },
                  {
                    value: 0,
                    label: "No",
                  },
                ]}
              />
            </Form.Item>
          </Col>
        )}

        {isRotaryType && (
          <Col span={24} md={12} lg={8}>
            <Form.Item name="feeding_trough_id" label="Feeding Troughs:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "71",
                }}
              />
            </Form.Item>
          </Col>
        )}
      </Row>

      <h2 className="text-lg font-medium">BARN FEED SYSTEM</h2>

      <div className="mb-4 mt-2 border border-gray-400">
        <div className="grid grid-cols-4 gap-4 border-b border-gray-400">
          <div className="border-r border-gray-400 py-3 font-semibold" />
          <div className="border-r border-gray-400 py-3 font-semibold">
            Feed Stations
          </div>
          <div className="border-r border-gray-400 py-3 font-semibold">
            Feed Types
          </div>
          <div className="py-3 font-semibold">Anti Bully Bars</div>
        </div>

        <div className="grid grid-cols-4 gap-4 border-b border-gray-400">
          <div className="border-r border-gray-400 py-2 pl-2 pt-3 font-semibold">
            Single
          </div>
          <div className="border-r border-gray-400 py-2">
            <Form.Item
              className="m-0 pr-[14px]"
              name="single_feed_station"
              rules={[
                () => ({
                  validator(_, value) {
                    if (!value) return Promise.resolve();
                    if (isNaN(value)) {
                      return Promise.reject(
                        new Error("Please enter valid number"),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input disabled={mode === "view"} />
            </Form.Item>
          </div>
          <div className="border-r border-gray-400 py-2">
            <Form.Item className="m-0" name="single_feed_type">
              <Radio.Group disabled={mode === "view"}>
                <Radio value="01">01</Radio>
                <Radio value="02">02</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <div className="py-2">
            <Form.Item
              className="m-0"
              name="single_anti_bully"
              valuePropName="checked"
            >
              <Checkbox disabled={mode === "view"} />
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 border-b border-gray-400">
          <div className="border-r border-gray-400 py-2 pl-2 pt-3 font-semibold">
            Double
          </div>
          <div className="border-r border-gray-400 py-2">
            <Form.Item
              className="m-0 pr-[14px]"
              name="double_feed_station"
              rules={[
                () => ({
                  validator(_, value) {
                    if (!value) return Promise.resolve();
                    if (isNaN(value)) {
                      return Promise.reject(
                        new Error("Please enter valid number"),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input disabled={mode === "view"} />
            </Form.Item>
          </div>
          <div className="border-r border-gray-400 py-2">
            <Form.Item className="m-0" name="double_feed_type">
              <Radio.Group disabled={mode === "view"}>
                <Radio value="01">01</Radio>
                <Radio value="02">02</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <div className="py-2">
            <Form.Item
              className="m-0"
              name="double_anti_bully"
              valuePropName="checked"
            >
              <Checkbox disabled={mode === "view"} />
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="border-r border-gray-400 py-2 pl-2 pt-3 font-semibold">
            Quad
          </div>
          <div className="border-r border-gray-400 py-2">
            <Form.Item
              className="m-0 pr-[14px]"
              name="quad_feed_station"
              rules={[
                () => ({
                  validator(_, value) {
                    if (!value) return Promise.resolve();
                    if (isNaN(value)) {
                      return Promise.reject(
                        new Error("Please enter valid number"),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input disabled={mode === "view"} />
            </Form.Item>
          </div>
          <div className="border-r border-gray-400 py-2">
            <Form.Item className="m-0" name="quad_feed_type">
              <Radio.Group disabled={mode === "view"}>
                <Radio value="01">01</Radio>
                <Radio value="02">02</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <div className="py-2">
            <Form.Item
              className="m-0"
              name="quad_anti_bully"
              valuePropName="checked"
            >
              <Checkbox disabled={mode === "view"} />
            </Form.Item>
          </div>
        </div>
      </div>

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
        <Button type="text" className="!bg-gray-1 text-white" onClick={onBack}>
          Back
        </Button>
        <Button
          type="primary"
          onClick={() => form.submit()}
          loading={isFormSubmitting}
        >
          Next
        </Button>
      </div>
    </Form>
  );
};

export default Step8Form;
