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
import useDebounce from "../../hooks/useDebounce";
import useError from "../../hooks/useError";
import {
  bulkDeleteAttribute,
  deleteAttribute,
  getAttributeList,
  setAttributeDeleteIDs,
  setAttributeListParams,
} from "../../store/features/attributeSlice";
const { Title } = Typography;

const Attributes = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo, deleteIDs } =
    useSelector((state) => state.attribute);

  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission["attribute"];

  const debouncedSearch = useDebounce(params.search, 500);

  useEffect(() => {
    dispatch(getAttributeList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.user_type,
    params.permission_id,
    debouncedSearch,
  ]);

  const onConfirm = async (id) => {
    try {
      await dispatch(deleteAttribute(id)).unwrap();
      toast.success("Attribute deleted successfully");
      await dispatch(getAttributeList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const onBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteAttribute(deleteIDs)).unwrap();
      toast.success("Attributes deleted successfully");
      await dispatch(getAttributeList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: "Attribute Name",
      dataIndex: "name",
      sorter: true,
      width: 150,
    },
    {
      title: "Created At",
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
            {permissions.edit ? (
              <Tooltip title="Edit">
                <Link to={`/attribute/edit/${id}`}>
                  <Button
                    type="text"
                    icon={<FilePenLine size={16} />}
                    className="text-gray-600"
                    size="small"
                  />
                </Link>
              </Tooltip>
            ) : null}

            {permissions.delete ? (
              <Popconfirm
                title="Delete the attribute"
                description="Are you sure to delete this attribute?"
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

  if (!permissions.edit && !permissions.delete) {
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
        <Title level={4}>ATTRIBUTE LIST</Title>
        <Breadcrumb
          items={[
            {
              title: "Attribute",
            },
            {
              title: "List",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="min-h-96 rounded-lg bg-white">
        <div className="flex flex-col items-center justify-between gap-2 border-b p-2 sm:flex-row">
          <Input
            placeholder="Search..."
            className="w-full md:w-60"
            value={params.search}
            onChange={(e) =>
              dispatch(setAttributeListParams({ search: e.target.value }))
            }
          />
          <div className="items-between flex w-full justify-end gap-2 md:flex-row">
            {permissions.add ? (
              <Link to="/attribute/create">
                <Button
                  type="primary"
                  icon={<Plus className="h-5 w-5" />}
                  className="sm:mb-0"
                >
                  Create
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {permissions.delete ? (
              <Popconfirm
                title="Delete the attributes"
                description="Are you sure to delete these attributes?"
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
            ) : (
              <div />
            )}
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
              permissions.delete
                ? {
                    type: "checkbox",
                    selectedRowKeys: deleteIDs,
                    onChange: (selectedRowKeys) =>
                      dispatch(setAttributeDeleteIDs(selectedRowKeys)),
                  }
                : null
            }
            pagination={{
              total: paginationInfo.total_records,
              pageSize: params.limit,
              current: params.page,
              showTotal: (total) => `Total ${total} attributes`,
            }}
            onChange={(e, b, c, d) => {
              dispatch(
                setAttributeListParams({
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

export default Attributes;
