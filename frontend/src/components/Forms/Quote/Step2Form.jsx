import { Button, Checkbox, Col, Form, Popconfirm, Row, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setInitialFormData } from "../../../store/features/quoteSlice";
import AsyncSelect from "../../AsyncSelect";

const Step2Form = ({
  onBack,
  onSubmit,
  isFormSubmitting,
  mode = "create",
  initialValues = null,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { selectedRequestType } = useSelector((state) => state.quote);
  const isRotaryType = selectedRequestType === 2;

  const onFinish = (values) => {
    dispatch(setInitialFormData({ tab: "step2", data: values }));
    const payload = {
      ...values,
      rump_rail_id: values.rump_rail_id ? values.rump_rail_id.value : null,
      rotary_rail_ramp_id: values.rotary_rail_ramp_id
        ? values.rotary_rail_ramp_id.value
        : null,
      front_guide_rail_id: values.front_guide_rail_id
        ? values.front_guide_rail_id.value
        : null,
      back_guide_rail_id: values.back_guide_rail_id
        ? values.back_guide_rail_id.value
        : null,
      front_exit_gate_id: values.front_exit_gate_id
        ? values.front_exit_gate_id.value
        : null,
      back_entrance_gate_id: values.back_entrance_gate_id
        ? values.back_entrance_gate_id.value
        : null,
      gate_control_id: values.gate_control_id
        ? values.gate_control_id.value
        : null,
      pit_kerb_rail_id: values.pit_kerb_rail_id
        ? values.pit_kerb_rail_id.value
        : null,
      stalling_id: values.stalling_id ? values.stalling_id.value : null,
      stalling_extra_id: values.stalling_extra_id
        ? values.stalling_extra_id.value
        : null,
      rotary_deck_id: values.rotary_deck_id
        ? values.rotary_deck_id.value
        : null,
      bail_type_id: values.bail_type_id ? values.bail_type_id.value : null,
      retention_arm_id: values.retention_arm_id
        ? values.retention_arm_id.value
        : null,
      rotation_id: values.rotation_id ? values.rotation_id.value : null,
      pace_entrance_system_id: values.pace_entrance_system_id
        ? values.pace_entrance_system_id.value
        : null,
      outer_nib_id: values.outer_nib_id ? values.outer_nib_id.value : null,
      inner_nib_id: values.inner_nib_id ? values.inner_nib_id.value : null,
      rail_ramp_id: values.rail_ramp_id ? values.rail_ramp_id.value : null,
      pro_floor_id: values.pro_floor_id ? values.pro_floor_id.value : null,
      request_type: selectedRequestType,
    };

    onSubmit(payload);
  };

  return (
    <Form
      name="step2"
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      form={form}
      initialValues={{
        ...initialValues,
        in_parlour_feeding: initialValues?.in_parlour_feeding || 0,
      }}
      scrollToFirstError={true}
    >
      {!isRotaryType ? (
        <Row gutter={12}>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="rump_rail_id" label="Rump Rails:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "7",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="front_guide_rail_id" label="Front Guide Rails:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "8",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="back_guide_rail_id" label="Back Guide Rails:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "9",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="front_exit_gate_id" label="Front Exit Gates:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "10",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name="back_entrance_gate_id"
              label="Back Entrance Gates:"
            >
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "11",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="gate_control_id" label="Gate Control:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "12",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="pit_kerb_rail_id" label="Pit Kerb Rail:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "13",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="stalling_id" label="Stalling:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "14",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="stalling_extra_id" label="Stalling Extras:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "15",
                }}
              />
            </Form.Item>
          </Col>

          <Col span={24} md={12} lg={8}>
            <Form.Item
              name="parlour_stall_extras"
              label="Parlour Stall Extras:"
            >
              <Checkbox.Group
                disabled={mode === "view"}
                options={[
                  { value: "Front pit steps", label: "Front pit steps" },
                  { value: "Back pit steps", label: "Back pit steps" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      ) : (
        <Row gutter={12}>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="rotary_deck_id" label="Rotary Deck:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "56",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="bail_type_id" label="Bail Type:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "57",
                }}
              />
            </Form.Item>
          </Col>

          <Col span={24} md={12} lg={8}>
            <Form.Item name="retention_arm_id" label="Retention Arms:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "58",
                }}
              />
            </Form.Item>
          </Col>

          <Col span={24} md={12} lg={8}>
            <Form.Item name="in_parlour_feeding" label="In Parlour Feeding">
              <Select
                allowClear
                optionFilterProp="label"
                showSearch
                disabled={mode === "view"}
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
            <Form.Item name="rotation_id" label="Rotation:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "60",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name="pace_entrance_system_id"
              label="Pace Entrance System:"
            >
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "61",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="outer_nib_id" label="Outer Nib:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "62",
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12} lg={8}>
            <Form.Item name="inner_nib_id" label="Inner Nib:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "63",
                }}
              />
            </Form.Item>
          </Col>

          <Col span={24} md={12} lg={8}>
            <Form.Item name="rotary_rail_ramp_id" label="Rotary Rail Ramp:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "65",
                }}
              />
            </Form.Item>
          </Col>

          <Col span={24} md={12} lg={8}>
            <Form.Item name="pro_floor_id" label="Pro Floor:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "64",
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      )}

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

export default Step2Form;
