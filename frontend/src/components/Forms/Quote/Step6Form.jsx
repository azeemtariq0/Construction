import { Button, Col, Form, Popconfirm, Row, Select } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setInitialFormData } from "../../../store/features/quoteSlice";
import AsyncSelect from "../../AsyncSelect";

const Step6Form = ({
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
    dispatch(setInitialFormData({ tab: "step6", data: values }));
    const payload = {
      ...values,
      cip_id: values.cip_id ? values.cip_id.value : null,
      wash_system_id: values.wash_system_id
        ? values.wash_system_id.value
        : null,
      chemical_pump_id: values.chemical_pump_id
        ? values.chemical_pump_id.value
        : null,
      parlour_wash_drop_id: values.parlour_wash_drop_id
        ? values.parlour_wash_drop_id.value
        : null,
      herringbone_parlour_wash_drop_id: values.herringbone_parlour_wash_drop_id
        ? values.herringbone_parlour_wash_drop_id.value
        : null,
      rotary_parlour_wash_drop_id: values.rotary_parlour_wash_drop_id
        ? values.rotary_parlour_wash_drop_id.value
        : null,
      wash_pump_unit_id: values.wash_pump_unit_id
        ? values.wash_pump_unit_id.value
        : null,
      rota_clean_wash_boom_id: values.rota_clean_wash_boom_id
        ? values.rota_clean_wash_boom_id.value
        : null,
      request_type: selectedRequestType,
    };

    onSubmit(payload);
  };

  return (
    <Form
      name="step6"
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
      form={form}
      initialValues={{
        ...initialValues,
        daytona_wash: initialValues?.daytona_wash || 0,
        water_boiler: initialValues?.water_boiler || 0,
        water_heater: initialValues?.water_heater || 0,
        rotary_platform_brush: initialValues?.rotary_platform_brush || 0,
      }}
      scrollToFirstError={true}
    >
      <h2 className="text-lg font-medium">PARLOUR WASHING</h2>

      <Row gutter={12}>
        {!isRotaryType && (
          <Col span={24} md={12} lg={8}>
            <Form.Item name="cip_id" label="CIP:">
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "36",
                }}
              />
            </Form.Item>
          </Col>
        )}

        <Col span={24} md={12} lg={8}>
          <Form.Item name="daytona_wash" label="Daytona Wash:">
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
          <Form.Item name="wash_system_id" label="Wash System:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "37",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="chemical_pump_id" label="Chemical Pumps:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "38",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="water_boiler" label="Water Boiler:">
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
          <Form.Item name="water_heater" label="Water Heater:">
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
      </Row>

      <h2 className="text-lg font-medium">PARLOUR WASH DOWN</h2>

      <Row gutter={12}>
        <Col span={24} md={12} lg={8}>
          {isRotaryType ? (
            <Form.Item
              name="rotary_parlour_wash_drop_id"
              label="Rotary Parlour Wash Drops:"
            >
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "73",
                }}
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="herringbone_parlour_wash_drop_id"
              label="Herringbone Parlour Wash Drops:"
            >
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "39",
                }}
              />
            </Form.Item>
          )}
        </Col>

        {isRotaryType ? (
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name="rota_clean_wash_boom_id"
              label="Rota Clean Wash Boom:"
            >
              <AsyncSelect
                disabled={mode === "view"}
                endpoint="/parlour-master"
                valueKey="id"
                labelKey="name"
                labelInValue
                params={{
                  module_id: "54",
                }}
              />
            </Form.Item>
          </Col>
        ) : null}

        <Col span={24} md={12} lg={8}>
          <Form.Item name="wash_pump_unit_id" label="Wash Pump Unit:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "40",
              }}
            />
          </Form.Item>
        </Col>

        {isRotaryType ? (
          <Col span={24} md={12} lg={8}>
            <Form.Item
              name="rotary_platform_brush"
              label="Rotary Platform Brush:"
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
        ) : null}
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

export default Step6Form;
