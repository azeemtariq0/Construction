import { Button, Col, Form, Input, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useError from "../../hooks/useError";
import {
  getQuoteMasterList,
  setQuoteMasterListParams,
} from "../../store/features/quoteMasterSlice";
import AsyncSelectNoPaginate from "../AsyncSelect/AsyncSelectNoPaginate";

const QuoteMasterForm = ({ mode = "create", onSubmit }) => {
  const [form] = Form.useForm();
  const handleError = useError();
  const dispatch = useDispatch();
  const {
    isFormSubmitting,
    initialFormValues,
    list,
    isListLoading,
    params,
    paginationInfo,
  } = useSelector((state) => state.quoteMaster);
  const [moduleID, setModuleID] = useState(
    mode === "edit" ? initialFormValues?.module_id?.value : null,
  );

  const getQuotes = () => {
    dispatch(getQuoteMasterList({ ...params, module_id: moduleID }))
      .unwrap()
      .catch(handleError);
  };

  useEffect(() => {
    moduleID ? getQuotes() : null;
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    moduleID,
  ]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      width: 150,
    },
    {
      title: "Type",
      dataIndex: "module_name",
      sorter: true,
      width: 150,
    },
  ];

  const onFinish = async (values) => {
    const res = await onSubmit({
      ...values,
      module_id: values.module_id ? values.module_id.value : null,
    });
    if (res) {
      form.setFieldsValue({ name: null });
      getQuotes();
    }
  };

  return (
    <Row gutter={[40, 16]}>
      <Col span={24} md={8}>
        <Form
          name="quote-master"
          onFinish={onFinish}
          autoComplete="off"
          form={form}
          layout="vertical"
          initialValues={mode === "edit" ? initialFormValues : {}}
        >
          <Form.Item
            label="Type"
            name="module_id"
            rules={[
              {
                required: true,
                message: "Type is required!",
              },
            ]}
          >
            <AsyncSelectNoPaginate
              endpoint="/lookups/parlour-modules"
              labelInValue
              onChange={(selected) =>
                setModuleID(selected ? selected.value : null)
              }
            />
          </Form.Item>{" "}
          <Form.Item
            label="Name"
            className="mt-8"
            name="name"
            rules={[
              {
                required: true,
                message: "Name is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <div className="mt-8 flex justify-end gap-2">
            <Link to="/quote-master" className="w-full">
              <Button htmlType="button" block>
                Cancel
              </Button>
            </Link>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={isFormSubmitting}
            >
              Save
            </Button>
          </div>
        </Form>
      </Col>
      <Col span={24} md={16}>
        {!!moduleID && (
          <Table
            columns={columns}
            showSorterTooltip={false}
            dataSource={list}
            rowKey="id"
            loading={isListLoading}
            size="small"
            scroll={{ y: 200, x: "calc(100% - 200px)" }}
            pagination={{
              total: paginationInfo.total_records,
              pageSize: params.limit,
              current: params.page,
              showTotal: (total) => `Total ${total} records`,
            }}
            onChange={(e, b, c, d) => {
              dispatch(
                setQuoteMasterListParams({
                  page: e.current,
                  limit: e.pageSize,
                  sort_column: c.field,
                  sort_direction: c.order,
                }),
              );
            }}
          />
        )}
      </Col>
    </Row>
  );
};
export default QuoteMasterForm;
