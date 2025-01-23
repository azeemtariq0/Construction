import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { Eye, FilePenLine, MessageSquare, UserRound } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useError from "../../hooks/useError";
import {
  changeAssignee,
  getQuotesList,
  setQuoteListParams,
  startReview,
} from "../../store/features/quoteSlice";
import AsyncSelect from "../AsyncSelect";
import CountrySelect from "../AsyncSelect/CountrySelect";

const Actions = ({ item }) => {
  const { user } = useSelector((state) => state.auth);
  const { params, isAssigneeChanging } = useSelector((state) => state.quote);
  const quotePermission = user.permission["parlour-request"];
  const { id, assignee, status } = item;
  const dispatch = useDispatch();
  const handleError = useError();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const onSubmit = async ({ assignee }) => {
    const payload = {
      user_id: user.user_id,
      request_id: id,
      assignee_id: assignee ? assignee.value : null,
    };

    if (item.assignee_id === payload.assignee_id) {
      handleCancel();
      return;
    }

    try {
      await dispatch(changeAssignee(payload)).unwrap();
      toast.success("Assignee changed successfully");
      handleCancel();
      await dispatch(
        getQuotesList({
          ...params,
          user_type: user.user_type,
          user_id: user.user_id,
        }),
      ).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onReviewStart = async (id) => {
    try {
      await dispatch(
        startReview({
          request_id: id,
          user_type: user.user_type,
          assignee: user.user_id,
        }),
      ).unwrap();
      toast.success("Quote request started for review");
      dispatch(
        getQuotesList({
          ...params,
          user_type: user.user_type,
          user_id: user.user_id,
        }),
      ).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Space wrap>
      <Tooltip title="View">
        <Link to={`/quote/view/${id}`}>
          <Button type="text" icon={<Eye size={16} />} size="small" />
        </Link>
      </Tooltip>

      {status !== "Draft" ? (
        <Tooltip title="Follow Up">
          <Link to={`/quote/view/${id}#chat`}>
            <Button
              type="text"
              icon={<MessageSquare size={16} />}
              size="small"
            />
          </Link>
        </Tooltip>
      ) : null}

      {assignee ? (
        quotePermission.edit && status !== "Processed" ? (
          <>
            <Tooltip title="Assignee">
              <Button
                type="text"
                icon={<UserRound size={16} />}
                size="small"
                onClick={showModal}
              />
            </Tooltip>
            <Tooltip title="Edit">
              <Link to={`/quote/edit/${id}`}>
                <Button
                  type="text"
                  icon={<FilePenLine size={16} />}
                  size="small"
                />
              </Link>
            </Tooltip>
          </>
        ) : null
      ) : (
        <Popconfirm
          title="Are you sure to start review?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => onReviewStart(id)}
        >
          <Button type="primary" className="h-6 px-2 py-3">
            Start Review
          </Button>
        </Popconfirm>
      )}
      <Modal
        title="Change Assignee"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="change-assignee"
          onFinish={onSubmit}
          autoComplete="off"
          layout="vertical"
          className="pt-2"
          initialValues={{
            assignee: item.assignee_id
              ? {
                  value: item.assignee_id,
                  label: item.assignee_name,
                }
              : null,
          }}
        >
          <Form.Item
            name="assignee"
            label="Assignee"
            rules={[
              {
                required: true,
                message: "Please select an assignee",
              },
            ]}
          >
            <AsyncSelect
              endpoint="/user?user_type=Internal"
              valueKey="id"
              labelKey="name"
              labelInValue
            />
          </Form.Item>

          <div className="flex items-center justify-end gap-2">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isAssigneeChanging}
            >
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </Space>
  );
};

const InternalTable = () => {
  const dispatch = useDispatch();
  const { params, paginationInfo, list, isLoading } = useSelector(
    (state) => state.quote,
  );

  const columns = [
    {
      title: (
        <div>
          <p>Name</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.customer_name}
            onChange={(e) =>
              dispatch(
                setQuoteListParams({
                  ...params,
                  customer_name: e.target.value,
                }),
              )
            }
          />
        </div>
      ),
      dataIndex: "name",
      sorter: true,
      width: 200,
    },
    {
      title: (
        <div>
          <p>Submitted By</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.submitted_by}
            onChange={(e) =>
              dispatch(
                setQuoteListParams({
                  ...params,
                  submitted_by: e.target.value,
                }),
              )
            }
          />
        </div>
      ),
      dataIndex: "submitted_name",
      sorter: true,
      width: 150,
    },
    {
      title: (
        <div>
          <p>Status</p>
          <Select
            className="w-full font-normal"
            size="small"
            optionFilterProp="label"
            onClick={(e) => e.stopPropagation()}
            options={[
              { value: "Submitted", label: "Submitted" },
              { value: "Under Review", label: "Under Review" },
              { value: "Processed", label: "Processed" },
              { value: "Expired", label: "Expired" },
            ]}
            showSearch
            allowClear
            value={params.status}
            onChange={(value) =>
              dispatch(
                setQuoteListParams({
                  ...params,
                  status: value,
                }),
              )
            }
          />
        </div>
      ),
      dataIndex: "status",
      sorter: true,
      width: 165,
      render: (status) => {
        switch (status) {
          case "Submitted":
            return (
              <Tag color="#2bff8e" className="!text-[#413B4D]">
                Submitted
              </Tag>
            );
          case "Under Review":
            return (
              <Tag color="#D7E5FF" className="!text-[#413B4D]">
                Under Review
              </Tag>
            );
          case "Processed":
            return (
              <Tag color="#DFFDE3" className="!text-[#413B4D]">
                Processed
              </Tag>
            );
          case "Expired":
            return (
              <Tag color="#FFD5D5" className="!text-[#413B4D]">
                Expired
              </Tag>
            );
        }
      },
    },
    {
      title: (
        <div>
          <p>Request Type</p>
          <Select
            className="w-full font-normal"
            size="small"
            optionFilterProp="label"
            onClick={(e) => e.stopPropagation()}
            options={[
              { value: 1, label: "Herringbone" },
              { value: 2, label: "Rotary" },
            ]}
            showSearch
            allowClear
            value={params.request_type}
            onChange={(value) =>
              dispatch(
                setQuoteListParams({
                  ...params,
                  request_type: value,
                }),
              )
            }
          />
        </div>
      ),
      dataIndex: "request_type",
      sorter: true,
      width: 160,
      render: (type) => (type === 1 ? "Herringbone" : "Rotary"),
    },
    {
      title: (
        <div>
          <p>Date Submitted</p>
          <div onClick={(e) => e.stopPropagation()}>
            <DatePicker.RangePicker
              placeholder={["From", "Till Now"]}
              mode={["date"]}
              allowEmpty={[false, true]}
              className="w-full font-normal"
              size="small"
              format="DD-MM-YYYY"
              value={[
                params?.submitted_date1 ? dayjs(params?.submitted_date1) : null,
                params?.submitted_date2 ? dayjs(params?.submitted_date2) : null,
              ]}
              onChange={(date) => {
                if (date) {
                  const startDate = date[0]
                    ? dayjs(date[0]).format("YYYY-MM-DD")
                    : "";
                  const endDate = date[1]
                    ? dayjs(date[1]).format("YYYY-MM-DD")
                    : "";
                  dispatch(
                    setQuoteListParams({
                      ...params,
                      submitted_date1: startDate,
                      submitted_date2: endDate,
                    }),
                  );
                } else {
                  dispatch(
                    setQuoteListParams({
                      ...params,
                      submitted_date1: null,
                      submitted_date2: null,
                    }),
                  );
                }
              }}
            />
          </div>
        </div>
      ),
      render: (_, { submitted_date }) =>
        submitted_date ? (
          dayjs(submitted_date).format("DD-MM-YYYY")
        ) : (
          <p className="text-gray-400">Not Submitted</p>
        ),
      dataIndex: "submitted_date",
      sorter: true,
      width: 250,
    },
    {
      title: (
        <div>
          <p>Assignee</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.assignee}
            onChange={(e) =>
              dispatch(
                setQuoteListParams({
                  ...params,
                  assignee: e.target.value,
                }),
              )
            }
          />
        </div>
      ),
      dataIndex: "assignee_name",
      sorter: true,
      width: 150,
      render: (assignee_name) =>
        assignee_name || <p className="text-gray-400">Unassigned</p>,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Country</p>
          <CountrySelect
            className="w-full font-normal"
            size="small"
            onChange={(value) => {
              const country_id = value ? value.split(",")[0] : null;
              dispatch(
                setQuoteListParams({
                  ...params,
                  country_id,
                }),
              );
            }}
          />
        </div>
      ),
      dataIndex: "country_name",
      sorter: true,
      width: 180,
    },
    {
      title: <div className="pb-5">Actions</div>,
      dataIndex: "actions",
      width: 140,
      render: (_, item) => <Actions key={item.id} item={item} />,
      fixed: "right",
    },
  ];

  return (
    <Table
      columns={columns}
      loading={isLoading}
      dataSource={list}
      rowKey="id"
      pagination={{
        total: paginationInfo.total_records,
        pageSize: params.limit,
        current: params.page,
        showTotal: (total) => `Total ${total} records`,
      }}
      scroll={{ y: 240, x: "calc(100% - 200px)" }}
      onChange={(e, b, c, d) => {
        dispatch(
          setQuoteListParams({
            page: e.current,
            limit: e.pageSize,
            sort_column: c.field,
            sort_direction: c.order,
          }),
        );
      }}
      showSorterTooltip={false}
      size="small"
      sortDirections={["ascend", "descend"]}
    />
  );
};

export default InternalTable;
