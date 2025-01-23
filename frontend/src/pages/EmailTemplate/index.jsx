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
  deleteEmailTemplate,
  getEmailTemplateList,
  setEmailTemplateListParams,
} from "../../store/features/emailTemplateSlice";
const { Title } = Typography;

const EmailTemplate = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { list, isListLoading, params, paginationInfo } = useSelector(
    (state) => state.emailTemplate,
  );

  const { user } = useSelector((state) => state.auth);
  const permission = user.permission["email-template"];

  const debouncedSearch = useDebounce(params.search, 500);

  useEffect(() => {
    dispatch(getEmailTemplateList(params)).unwrap().catch(handleError);
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
      await dispatch(deleteEmailTemplate(id)).unwrap();
      toast.success("Email Template deleted successfully");
      await dispatch(getEmailTemplateList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: "Module",
      dataIndex: "module",
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
            {permission.edit ? (
              <Tooltip title="Edit">
                <Link to={`/email-template/edit/${id}`}>
                  <Button
                    type="text"
                    icon={<FilePenLine size={16} />}
                    className="text-gray-600"
                    size="small"
                  />
                </Link>
              </Tooltip>
            ) : null}

            {permission.delete ? (
              <Popconfirm
                title="Delete the email template"
                description="Are you sure to delete this email template?"
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

  if (!permission.edit && !permission.delete) {
    columns.pop();
  }

  const dataSource = list.map((item) => ({
    ...item,
    created_at: item.created_at
      ? dayjs(item.created_at).format("DD-MM-YYYY hh:mm A")
      : null,
    key: item.module.replaceAll(" ", "-"),
    actions: item.module.replaceAll(" ", "-"),
  }));

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>EMAIL TEMPLATE LIST</Title>
        <Breadcrumb
          items={[
            {
              title: "Email Template",
            },
            {
              title: "List",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="min-h-96 rounded-lg bg-white">
        <div className="flex items-center justify-between gap-2 border-b p-2">
          <Input
            placeholder="Search..."
            className="w-full md:w-60"
            value={params.search}
            onChange={(e) =>
              dispatch(setEmailTemplateListParams({ search: e.target.value }))
            }
          />
          {permission.add ? (
            <Link to="/email-template/create">
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
        </div>

        <div className="p-2 sm:p-4">
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
              showTotal: (total) => `Total ${total} templates`,
            }}
            onChange={(e, b, c, d) => {
              dispatch(
                setEmailTemplateListParams({
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

export default EmailTemplate;
