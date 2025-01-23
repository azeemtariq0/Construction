import { Button, Col, Form, Popconfirm, Row, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setInitialFormData } from "../../../store/features/quoteSlice";
import AsyncSelect from "../../AsyncSelect";

const Step3Form = ({
  onSubmit,
  onBack,
  isFormSubmitting,
  mode = "create",
  initialValues = null,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { selectedRequestType } = useSelector((state) => state.quote);
  const isRotaryType = selectedRequestType === 2;

  const onFinish = (values) => {
    dispatch(setInitialFormData({ tab: "step3", data: values }));
    const payload = {
      ...values,
      rotary_vacuum_line_id: values.rotary_vacuum_line_id
        ? values.rotary_vacuum_line_id.value
        : null,
      herringbone_vacuum_line_id: values.herringbone_vacuum_line_id
        ? values.herringbone_vacuum_line_id.value
        : null,
      vacuum_outfit_id: values.vacuum_outfit_id
        ? values.vacuum_outfit_id.value
        : null,
      pump_type_id: values.pump_type_id ? values.pump_type_id.value : null,
      pulsation_system_id: values.pulsation_system_id
        ? values.pulsation_system_id.value
        : null,
      pulsation_type_id: values.pulsation_type_id
        ? values.pulsation_type_id.value
        : null,
      cluster_unit_id: values.cluster_unit_id
        ? values.cluster_unit_id.value
        : null,
      herringbone_cluster_support_id: values.herringbone_cluster_support_id
        ? values.herringbone_cluster_support_id.value
        : null,
      rotary_cluster_support_id: values.rotary_cluster_support_id
        ? values.rotary_cluster_support_id.value
        : null,
      request_type: selectedRequestType,
    };

    onSubmit(payload);
  };

  return (
    <Form
      name="step3"
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
      form={form}
      initialValues={{
        ...initialValues,
        motors: initialValues?.motors || 0,
        vdrive_system: initialValues?.vdrive_system || 0,
        fresh_air_line: initialValues?.fresh_air_line || 0,
      }}
      scrollToFirstError={true}
    >
      <h2 className="text-lg font-medium">VACUUM</h2>
      <Row gutter={16}>
        <Col span={24} md={12} lg={8}>
          {isRotaryType ? (
            <Form.Item name="rotary_vacuum_line_id" label="Rotary Vacuum Line:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "67",
                }}
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="herringbone_vacuum_line_id"
              label="Herringbone Vacuum Line:"
            >
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "16",
                }}
              />
            </Form.Item>
          )}
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="vacuum_outfit_id" label="Vacuum Outfit:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "17",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="pump_type_id" label="Pump Type:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "18",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="motors" label="Motors:">
            <Select
              optionFilterProp="label"
              options={[
                { value: 1, label: "Yes" },
                { value: 0, label: "No" },
              ]}
              disabled={mode === "view"}
              showSearch
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="vdrive_system" label="VDrive System:">
            <Select
              options={[
                { value: 1, label: "Yes" },
                { value: 0, label: "No" },
              ]}
              disabled={mode === "view"}
              optionFilterProp="label"
              showSearch
            />
          </Form.Item>
        </Col>
      </Row>

      <h2 className="text-lg font-medium">MILKING POINT</h2>
      <Row gutter={12}>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="pulsation_system_id" label="Pulsation System:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "19",
              }}
            />
          </Form.Item>
        </Col>

        <Col span={24} md={12} lg={8}>
          <Form.Item name="pulsation_type_id" label="Pulsation Type">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "20",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="fresh_air_line" label="Fresh Air Line">
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
          <Form.Item name="cluster_unit_id" label="Cluster Units">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "21",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          {isRotaryType ? (
            <Form.Item
              name="rotary_cluster_support_id"
              label="Rotary Cluster Support"
            >
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "72",
                }}
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="herringbone_cluster_support_id"
              label="Herringbone Cluster Support"
            >
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "22",
                }}
              />
            </Form.Item>
          )}
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

export default Step3Form;
