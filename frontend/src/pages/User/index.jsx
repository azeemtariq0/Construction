import {
  Breadcrumb,
  Button,
  Input,
  Popconfirm,
  Select,
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
import AsyncSelect from "../../components/AsyncSelect";
import useDebounce from "../../hooks/useDebounce";
import useError from "../../hooks/useError";
import {
  deleteUser,
  getUserList,
  setUserListParams,
} from "../../store/features/userSlice";
const { Title } = Typography;

const User = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo } = useSelector(
    (state) => state.user,
  );

  const {
    user: {
      permission: { user },
    },
  } = useSelector((state) => state.auth);

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedUserName = useDebounce(params.name, 500);
  const debouncedEmail = useDebounce(params.email, 500);

  useEffect(() => {
    dispatch(getUserList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.user_type,
    params.permission_id,
    debouncedSearch,
    debouncedUserName,
    debouncedEmail,
  ]);

  const onConfirm = async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success("User deleted successfully");
      await dispatch(getUserList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: (
        <div>
          <p>Email Address</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.email}
            onChange={(e) =>
              dispatch(setUserListParams({ email: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: "email",
      sorter: true,
      width: 150,
    },
    {
      title: (
        <div>
          <p>User Name</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.name}
            onChange={(e) =>
              dispatch(setUserListParams({ name: e.target.value }))
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
          <p>User Permission</p>
          <AsyncSelect
            endpoint="/permission"
            valueKey="user_permission_id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.permission_id}
            onChange={(value) =>
              dispatch(setUserListParams({ permission_id: value }))
            }
          />
        </div>
      ),
      dataIndex: "permission_name",
      sorter: true,
      width: 160,
    },
    {
      title: (
        <div>
          <p>User Type</p>
          <Select
            className="w-full font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            options={[
              {
                value: "Internal",
                label: "Internal",
              },
              {
                value: "Partner",
                label: "Partner",
              },
            ]}
            allowClear
            optionFilterProp="label"
            showSearch
            value={params.user_type}
            onChange={(value) =>
              dispatch(setUserListParams({ user_type: value }))
            }
          />
        </div>
      ),
      dataIndex: "user_type",
      sorter: true,
      width: 120,
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
            {user.edit ? (
              <Tooltip title="Edit">
                <Link to={`/user-management/edit/${id}`}>
                  <Button
                    type="text"
                    icon={<FilePenLine size={16} />}
                    className="text-gray-600"
                    size="small"
                  />
                </Link>
              </Tooltip>
            ) : null}

            {user.delete ? (
              <Popconfirm
                title="Delete the user"
                description="Are you sure to delete this user?"
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

  if (!user.edit && !user.delete) {
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
        <Title level={4}>USER LIST</Title>
        <Breadcrumb
          items={[
            {
              title: "User Management",
            },
            {
              title: "List",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="min-h-96 rounded-lg bg-white p-2 sm:p-4">
        {user.add ? (
          <div className="mb-2 flex justify-end">
            <Link to="/user-management/create">
              <Button
                type="primary"
                icon={<Plus className="h-5 w-5" />}
                className="mb-2 sm:mb-0"
              >
                Add User
              </Button>
            </Link>
          </div>
        ) : null}

        <Table
          columns={columns}
          showSorterTooltip={false}
          dataSource={dataSource}
          loading={isListLoading}
          size="small"
          scroll={{ y: 240, x: "calc(100% - 200px)" }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} users`,
          }}
          onChange={(e, b, c, d) => {
            dispatch(
              setUserListParams({
                page: e.current,
                limit: e.pageSize,
                sort_column: c.field,
                sort_direction: c.order,
              }),
            );
          }}
        />
      </div>
    </>
  );
};

export default User;
