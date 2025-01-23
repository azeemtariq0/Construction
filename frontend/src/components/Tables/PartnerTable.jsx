import {
  Button,
  DatePicker,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { Eye, FilePenLine, MessageSquare, X } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useError from "../../hooks/useError";
import {
  deleteQuote,
  getQuotesList,
  setQuoteDeleteIDs,
  setQuoteListParams,
} from "../../store/features/quoteSlice";

const PartnerTable = () => {
  const dispatch = useDispatch();
  const handleError = useError();

  const { params, paginationInfo, list, isLoading, deleteIDs } = useSelector(
    (state) => state.quote,
  );
  const { user } = useSelector((state) => state.auth);
  const quotePermission = user.permission["parlour-request"];
  const userType = user.user_type;

  const onQuoteDelete = async (id) => {
    try {
      await dispatch(deleteQuote(id)).unwrap();
      toast.success("Quote deleted successfully");
      dispatch(
        getQuotesList({
          ...params,
          user_type: userType,
          user_id: user.user_id,
        }),
      ).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

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
      width: 120,
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
          <p>Status</p>
          <Select
            className="w-full font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            options={[
              { value: "Submitted", label: "Submitted" },
              { value: "Under Review", label: "Under Review" },
              { value: "Processed", label: "Processed" },
              { value: "Draft", label: "Draft" },
              { value: "Expired", label: "Expired" },
            ]}
            optionFilterProp="label"
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
      width: 150,
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
          case "Draft":
            return (
              <Tag color="#EDE9FF" className="!text-[#413B4D]">
                Draft
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
      title: "Actions",
      dataIndex: "actions",
      width: 100,
      fixed: "right",
      render: (_, { id, status }) => {
        return (
          <Space>
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

            {quotePermission.edit && status === "Draft" ? (
              <Tooltip title="Edit">
                <Link to={`/quote/edit/${id}`}>
                  <Button
                    type="text"
                    icon={<FilePenLine size={16} />}
                    size="small"
                  />
                </Link>
              </Tooltip>
            ) : null}
            {quotePermission.delete && status === "Draft" ? (
              <Popconfirm
                title="Delete the request"
                description="Are you sure to delete this request?"
                onConfirm={() => onQuoteDelete(id)}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Delete">
                  <Button
                    type="text"
                    size="small"
                    icon={<X size={16} />}
                    danger
                  />
                </Tooltip>
              </Popconfirm>
            ) : null}
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      loading={isLoading}
      dataSource={list}
      rowKey="id"
      rowSelection={
        quotePermission.delete
          ? {
              type: "checkbox",
              selectedRowKeys: deleteIDs,
              onChange: (selectedRowKeys) =>
                dispatch(setQuoteDeleteIDs(selectedRowKeys)),
              getCheckboxProps: (record) => ({
                disabled: record.status !== "Draft",
              }),
            }
          : null
      }
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

export default PartnerTable;
