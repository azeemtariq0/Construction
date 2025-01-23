import { Button, Col, Form, Input, Popconfirm, Row, Select } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setInitialFormData } from "../../../store/features/quoteSlice";
import AsyncSelect from "../../AsyncSelect";

const Step7Form = ({
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
    dispatch(setInitialFormData({ tab: "step7", data: values }));
    const payload = {
      ...values,
      animal_selection_id: values.animal_selection_id
        ? values.animal_selection_id.value
        : null,
      crowd_gate_id: values.crowd_gate_id ? values.crowd_gate_id.value : null,
      rotary_teat_spray_id: values.rotary_teat_spray_id
        ? values.rotary_teat_spray_id.value
        : null,
      herringbone_teat_spray_id: values.herringbone_teat_spray_id
        ? values.herringbone_teat_spray_id.value
        : null,
      leg_divider_id: values.leg_divider_id
        ? values.leg_divider_id.value
        : null,
      udder_washer_id: values.udder_washer_id
        ? values.udder_washer_id.value
        : null,
      extender_unit_id: values.extender_unit_id
        ? values.extender_unit_id.value
        : null,
      smart_collar_type_id: values.smart_collar_type_id
        ? values.smart_collar_type_id.value
        : null,
      request_type: selectedRequestType,
    };

    onSubmit(payload);
  };

  return (
    <Form
      name="step7"
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
      form={form}
      initialValues={{
        ...initialValues,
        airstream_cluster_flush: initialValues?.airstream_cluster_flush || 0,
        base_station: initialValues?.base_station || 0,
        nedap_now: initialValues?.nedap_now || 0,
      }}
      scrollToFirstError={true}
    >
      <h2 className="text-lg font-medium">HERD MANAGEMENT</h2>
      <Row gutter={12}>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="animal_selection_id" label="Animal Selection:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "41",
              }}
            />
          </Form.Item>
        </Col>

        <Col span={24} md={12} lg={8}>
          <Form.Item name="crowd_gate_id" label="Crowd Gate:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "42",
              }}
            />
          </Form.Item>
        </Col>

        <Col span={12} md={6} lg={4}>
          <Form.Item
            name="width"
            label="Width:"
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
        </Col>
        <Col span={12} md={6} lg={4}>
          <Form.Item
            name="length"
            label="Length:"
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
        </Col>

        {isRotaryType && (
          <Col span={24} md={12} lg={8}>
            <Form.Item name="leg_divider_id" label="Leg Dividers:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "53",
                }}
              />
            </Form.Item>
          </Col>
        )}
      </Row>

      <h2 className="text-lg font-medium">ANIMAL HEALTH</h2>

      <Row gutter={12}>
        <Col span={24} md={12} lg={8}>
          <Form.Item
            name="airstream_cluster_flush"
            label="Airstream Cluster Flush:"
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

        {isRotaryType ? (
          <Col span={24} md={12} lg={8}>
            <Form.Item name="rotary_teat_spray_id" label="Rotary Teat Spray:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "43",
                }}
              />
            </Form.Item>
          </Col>
        ) : (
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name="herringbone_teat_spray_id"
              label="Herringbone Teat Spray:"
            >
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "52",
                }}
              />
            </Form.Item>
          </Col>
        )}

        {!isRotaryType && (
          <Col span={24} md={12} lg={8}>
            <Form.Item name="udder_washer_id" label="Udder Washer:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "44",
                }}
              />
            </Form.Item>
          </Col>
        )}
      </Row>
      <h2 className="text-lg font-medium">ANIMAL MONITORING</h2>

      <Row gutter={12}>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="smart_collar_type_id" label="Smart Collar Type:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "45",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="base_station" label="Base Station:">
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
          <Form.Item name="extender_unit_id" label="Extender Unit:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "46",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="nedap_now" label="Nedap Now:">
            <Select
              disabled={mode === "view"}
              optionFilterProp="label"
              showSearch
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

export default Step7Form;
