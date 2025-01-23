import { Button, Col, Form, Popconfirm, Row, Select } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setInitialFormData } from "../../../store/features/quoteSlice";
import AsyncSelect from "../../AsyncSelect";

const Step4Form = ({
  onSubmit,
  onBack,
  isFormSubmitting,
  mode = "create",
  initialValues = null,
}) => {
  const [form] = Form.useForm();
  const inline_filters = Form.useWatch("inline_filters", form);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedRequestType } = useSelector((state) => state.quote);

  const onFinish = (values) => {
    dispatch(setInitialFormData({ tab: "step4", data: values }));
    const payload = {
      ...values,
      delivery_milk_pump_id: values.delivery_milk_pump_id
        ? values.delivery_milk_pump_id.value
        : null,
      plate_cooler_id: values.plate_cooler_id
        ? values.plate_cooler_id.value
        : null,
      bulk_tank_filling_id: values.bulk_tank_filling_id
        ? values.bulk_tank_filling_id.value
        : null,
      diversion_milk_pump_id: values.diversion_milk_pump_id
        ? values.diversion_milk_pump_id.value
        : null,
      bucket_assembly_id: values.bucket_assembly_id
        ? values.bucket_assembly_id.value
        : null,
      bucket_qty_id: values.bucket_qty_id ? values.bucket_qty_id.value : null,
      request_type: selectedRequestType,
    };

    onSubmit(payload);
  };

  return (
    <Form
      name="step4"
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      form={form}
      initialValues={{
        ...initialValues,
        mdrive_system: initialValues?.mdrive_system || 0,
        delivery_receiving_vessel:
          initialValues?.delivery_receiving_vessel || 0,
        sanitary_vessel: initialValues?.sanitary_vessel || 0,
        milk_wash_line: initialValues?.milk_wash_line || 0,
        airforce_air_purge: initialValues?.airforce_air_purge || 0,
        plate_cooler_solenoid: initialValues?.plate_cooler_solenoid || 0,
        divert_line: initialValues?.divert_line || 0,
        easy_milk_line: initialValues?.easy_milk_line || 0,
      }}
      scrollToFirstError={true}
    >
      <h2 className="text-lg font-medium">MILK DELIVERY SYSTEM</h2>

      <Row gutter={16}>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="delivery_milk_pump_id" label="Delivery Milk Pump:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "23",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="mdrive_system" label="MDrive System:">
            <Select
              optionFilterProp="label"
              disabled={mode === "view"}
              options={[
                { value: 1, label: "Yes" },
                { value: 0, label: "No" },
              ]}
              showSearch
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="delivery_receiving_vessel" label="Receiving Vessel:">
            <Select
              disabled={mode === "view"}
              options={[
                { value: 1, label: "Yes" },
                { value: 0, label: "No" },
              ]}
              optionFilterProp="label"
              showSearch
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="sanitary_vessel" label="Sanitary Vessel:">
            <Select
              disabled={mode === "view"}
              optionFilterProp="label"
              options={[
                { value: 1, label: "Yes" },
                { value: 0, label: "No" },
              ]}
              showSearch
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="milk_wash_line" label="Milk / Wash Line:">
            <Select
              disabled={mode === "view"}
              options={[
                { value: 1, label: "Yes" },
                { value: 0, label: "No" },
              ]}
              optionFilterProp="label"
              showSearch
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <div className="flex items-center gap-2">
            <Form.Item
              name="inline_filters"
              label="Inline Filters:"
              className="w-full"
            >
              <Select
                disabled={mode === "view"}
                options={[
                  { value: "Standard Filter", label: "Standard Filter" },
                  { value: "Reusable Filter", label: "Reusable Filter" },
                ]}
                allowClear
                onChange={(selected) => !selected && form.resetFields(["qty"])}
                optionFilterProp="label"
                showSearch
              />
            </Form.Item>

            <Form.Item name="qty" label="Qty:" className="w-full">
              <Select
                disabled={mode === "view" || !inline_filters}
                options={[
                  { value: 1, label: 1 },
                  { value: 2, label: 2 },
                  { value: 3, label: 3 },
                  { value: 4, label: 4 },
                ]}
                optionFilterProp="label"
                showSearch
              />
            </Form.Item>
          </div>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="airforce_air_purge" label="AirForce Air Purge:">
            <Select
              disabled={mode === "view"}
              options={[
                { value: 1, label: "Yes" },
                { value: 0, label: "No" },
              ]}
              optionFilterProp="label"
              showSearch
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="plate_cooler_id" label="Plate Cooler:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "25",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item
            name="plate_cooler_solenoid"
            label="Plate Cooler Solenoid:"
          >
            <Select
              disabled={mode === "view"}
              options={[
                { value: 1, label: "Yes" },
                { value: 0, label: "No" },
              ]}
              optionFilterProp="label"
              showSearch
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="bulk_tank_filling_id" label="Bulk Tank Filling:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "26",
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <h2 className="text-lg font-medium">MILK DIVERSION SYSTEM</h2>

      <Row gutter={12}>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="diversion_milk_pump_id" label="Diversion Milk Pump:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "66",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item
            name="diversion_receiving_vessel"
            label="Receiving Vessel:"
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
          <Form.Item name="divert_line" label="Divert Line:">
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
          <Form.Item name="easy_milk_line" label="Easy Milk Line:">
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
          <Form.Item name="bucket_assembly_id" label="Bucket Assembly:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "28",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24} md={12} lg={8}>
          <Form.Item name="bucket_qty_id" label="Bucket Qty:">
            <AsyncSelect
              disabled={mode === "view"}
              endpoint="/parlour-master"
              valueKey="id"
              labelKey="name"
              labelInValue
              params={{
                module_id: "29",
              }}
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

export default Step4Form;
