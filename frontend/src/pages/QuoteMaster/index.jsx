import {
  Breadcrumb,
  Button,
  Input,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { ChevronsRight, FilePenLine, Plus, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AsyncSelectNoPaginate from "../../components/AsyncSelect/AsyncSelectNoPaginate";
import useDebounce from "../../hooks/useDebounce";
import useError from "../../hooks/useError";
import {
  bulkDeleteQuoteMaster,
  deleteQuoteMaster,
  getQuoteMasterList,
  resetQuoteMasterTableSate,
  setQuoteMasterDeleteIDs,
  setQuoteMasterListParams,
} from "../../store/features/quoteMasterSlice";
const { Title } = Typography;

const QuoteMaster = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, deleteIDs } =
    useSelector((state) => state.quoteMaster);
  const {
    user: { permission },
  } = useSelector((state) => state.auth);
  const masterPermissions = permission["parlour-master"];

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedName = useDebounce(params.name, 500);

  useEffect(() => {
    dispatch(getQuoteMasterList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.module_id,
    debouncedSearch,
    debouncedName,
  ]);

  const onConfirm = async (id) => {
    try {
      await dispatch(deleteQuoteMaster(id)).unwrap();
      toast.success("Record deleted successfully");
      await dispatch(getQuoteMasterList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteQuoteMaster(deleteIDs)).unwrap();
      toast.success("Records deleted successfully");
      await dispatch(getQuoteMasterList(params)).unwrap();
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
            value={params.name}
            onChange={(e) =>
              dispatch(setQuoteMasterListParams({ name: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "name",
      sorter: true,
      width: 150,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Type</p>
          <AsyncSelectNoPaginate
            endpoint="/lookups/parlour-modules"
            value={params.module_id}
            className="w-full"
            size="small"
            onChange={(value) =>
              dispatch(setQuoteMasterListParams({ module_id: value }))
            }
          />
        </div>
      ),
      dataIndex: "module_name",
      sorter: true,
      width: 150,
    },
    {
      title: "Created at",
      dataIndex: "created_at",
      sorter: true,
      width: 160,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 80,
      render: (id) => {
        return (
          <Space>
            {masterPermissions.edit ? (
              <Tooltip title="Edit">
                <Link
                  to={`/quote-master/edit/${id}`}
                  onClick={() => dispatch(resetQuoteMasterTableSate())}
                >
                  <Button
                    type="text"
                    icon={<FilePenLine size={16} />}
                    size="small"
                  />
                </Link>
              </Tooltip>
            ) : null}

            {masterPermissions.delete ? (
              <Popconfirm
                title="Delete the record"
                description="Are you sure to delete this record?"
                onConfirm={() => onConfirm(id)}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Delete">
                  <Button
                    type="text"
                    icon={<X size={16} />}
                    danger
                    size="small"
                  />
                </Tooltip>
              </Popconfirm>
            ) : null}
          </Space>
        );
      },
    },
  ];

  if (!masterPermissions.edit && !masterPermissions.delete) {
    columns.pop();
  }

  const dataSource = list.map((item) => ({
    ...item,
    created_at: item.created_at
      ? dayjs(item.created_at).format("DD-MM-YYYY hh:mm A")
      : null,
    key: item.id,
    actions: item.id,
  }));

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>QUOTE MASTER LIST</Title>
        <Breadcrumb
          items={[
            {
              title: "Quote Master",
            },
            {
              title: "List",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="min-h-96 rounded-lg bg-white">
        <div className="flex items-center justify-between border-b p-2">
          <p className="text-base">Quote Request List</p>
          <div className="flex items-center gap-2">
            {masterPermissions.add ? (
              <Link to="/quote-master/create">
                <Button
                  type="primary"
                  icon={<Plus className="h-5 w-5" />}
                  className="sm:mb-0"
                >
                  Create
                </Button>
              </Link>
            ) : null}

            {masterPermissions.delete ? (
              <Popconfirm
                title="Delete the records"
                description="Are you sure to delete these records?"
                onConfirm={onBulkDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  icon={<Trash2 size={16} />}
                  disabled={deleteIDs.length === 0}
                />
              </Popconfirm>
            ) : null}
          </div>
        </div>

        <div className="p-2 sm:p-4">
          <Table
            columns={columns}
            showSorterTooltip={false}
            dataSource={dataSource}
            loading={isListLoading}
            size="small"
            scroll={{ y: 240, x: "calc(100% - 200px)" }}
            rowSelection={
              masterPermissions.delete
                ? {
                    type: "checkbox",
                    selectedRowKeys: deleteIDs,
                    onChange: (selectedRowKeys) =>
                      dispatch(setQuoteMasterDeleteIDs(selectedRowKeys)),
                  }
                : null
            }
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
        </div>
      </div>
    </>
  );
};

export default QuoteMaster;
