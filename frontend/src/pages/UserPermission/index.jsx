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
import { ChevronsRight, FilePenLine, Plus, X } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import useError from "../../hooks/useError";
import {
  deleteUserPermission,
  getUserPermissionList,
  setUserPermissionListParams,
} from "../../store/features/userPermissionSlice";
const { Title } = Typography;

const UserPermission = () => {
  const handleError = useError();
  const dispatch = useDispatch();

  const { params, paginationInfo, list, isLoading } = useSelector(
    (state) => state.userPermission,
  );
  const {
    user: {
      permission: { user_permission },
    },
  } = useSelector((state) => state.auth);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedName = useDebounce(params.name, 500);
  const debouncedDesc = useDebounce(params.description, 500);

  useEffect(() => {
    dispatch(getUserPermissionList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    debouncedSearch,
    params.sort_column,
    params.sort_direction,
    debouncedName,
    debouncedDesc,
  ]);

  const onUserPermissionDelete = async (id) => {
    dispatch(deleteUserPermission(id))
      .unwrap()
      .then(() => {
        toast.success("User permission deleted successfully");
        dispatch(getUserPermissionList(params)).unwrap().catch(handleError);
      })
      .catch(handleError);
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
              dispatch(setUserPermissionListParams({ name: e.target.value }))
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
          <p>Description</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.description}
            onChange={(e) =>
              dispatch(
                setUserPermissionListParams({ description: e.target.value }),
              )
            }
          />
        </div>
      ),
      dataIndex: "description",
      sorter: true,
      width: 300,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
      width: 160,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 80,
      fixed: "right",
      render: (id) => {
        return (
          <Space>
            {user_permission.edit ? (
              <Tooltip title="Edit">
                <Link to={`/user-permission/edit/${id}`}>
                  <Button
                    type="text"
                    icon={<FilePenLine size={16} />}
                    size="small"
                  />
                </Link>
              </Tooltip>
            ) : null}
            {user_permission.delete ? (
              <Popconfirm
                title="Delete the user permission"
                description="Are you sure to delete this user permission?"
                onConfirm={() => onUserPermissionDelete(id)}
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

  if (!user_permission.edit && !user_permission.delete) {
    columns.pop();
  }

  const data = list.map((groupPermission) => ({
    ...groupPermission,
    key: groupPermission.user_permission_id,
    actions: groupPermission.user_permission_id,
    created_at: groupPermission.created_at
      ? dayjs(groupPermission.created_at).format("DD-MM-YYYY hh:mm A")
      : null,
  }));

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>USER PERMISSION LIST</Title>
        <Breadcrumb
          items={[
            {
              title: "User Permission",
            },
            {
              title: "List",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="min-h-96 rounded-lg bg-white p-2 sm:p-4">
        {user_permission.add ? (
          <div className="mb-2 flex justify-end">
            <Link to="/user-permission/create">
              <Button
                type="primary"
                icon={<Plus className="h-5 w-5" />}
                className="mb-2 sm:mb-0"
              >
                Create
              </Button>
            </Link>
          </div>
        ) : null}

        <Table
          columns={columns}
          loading={isLoading}
          dataSource={data}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} user permissions`,
          }}
          scroll={{ y: 240, x: "calc(100% - 200px)" }}
          onChange={(e, b, c, d) => {
            dispatch(
              setUserPermissionListParams({
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
      </div>
    </>
  );
};

export default UserPermission;
