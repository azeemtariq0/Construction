import { Button, Checkbox, Col, Form, Popconfirm, Row, Select } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setInitialFormData } from "../../../store/features/quoteSlice";
import AsyncSelect from "../../AsyncSelect";

const Step5Form = ({
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
    dispatch(setInitialFormData({ tab: "step5", data: values }));
    const payload = {
      ...values,
      unit_control_id: values.unit_control_id
        ? values.unit_control_id.value
        : null,
      milk_sensor_id: values.milk_sensor_id
        ? values.milk_sensor_id.value
        : null,
      sampling_device_id: values.sampling_device_id
        ? values.sampling_device_id.value
        : null,
      herringbone_easy_start_id: values.herringbone_easy_start_id
        ? values.herringbone_easy_start_id.value
        : null,
      rotary_easy_start_id: values.rotary_easy_start_id
        ? values.rotary_easy_start_id.value
        : null,
      parlour_identification_id: values.parlour_identification_id
        ? values.parlour_identification_id.value
        : null,
      transponder_type_id: values.transponder_type_id
        ? values.transponder_type_id.value
        : null,
      request_type: selectedRequestType,
    };

    onSubmit(payload);
  };

  return (
    <Form
      name="step5"
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off"
      form={form}
      initialValues={{
        ...initialValues,
        touch_screen: initialValues?.touch_screen || 0,
        voice_assist: initialValues?.voice_assist || 0,
      }}
      scrollToFirstError={true}
    >
      <h2 className="text-lg font-medium">MILKING UNIT AUTOMATION</h2>

      <Row gutter={16}>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="unit_control_id" label="Unit Control:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "30",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="milk_sensor_id" label="Milk Sensor:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "31",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="sampling_device_id" label="Sampling Device:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "32",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          {isRotaryType ? (
            <Form.Item name="rotary_easy_start_id" label="Rotary Easy Start:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "68",
                }}
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="herringbone_easy_start_id"
              label="Herringbone Easy Start:"
            >
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "33",
                }}
              />
            </Form.Item>
          )}
        </Col>
      </Row>

      <h2 className="text-lg font-medium">PARLOUR AUTOMATION</h2>

      <Row gutter={16}>
        <Col span={24} md={12} lg={8}>
          <Form.Item
            name="parlour_identification_id"
            label="Parlour Identification:"
          >
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "34",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="transponder_type_id" label="Transponder Type:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "35",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12} md={6} lg={4}>
          <Form.Item name="touch_screen" label="Touch Screen:">
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
        <Col span={12} md={6} lg={4}>
          <Form.Item name="voice_assist" label="Voice Assist:">
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

        <Col span={24}>
          <Form.Item
            name="vision_herd_management_extras"
            label="Vision Herd Management Extras:"
          >
            <Checkbox.Group
              disabled={mode === "view"}
              options={[
                {
                  value: "performance_monitor_bimodal_milking",
                  label: "Performance monitor / Bimodal Milking",
                },
                { value: "Nedap Link", label: "Nedap Link" },
                { value: "Tauras link", label: "Tauras link" },
              ]}
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

export default Step5Form;
