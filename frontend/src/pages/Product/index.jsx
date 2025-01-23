import {
  Breadcrumb,
  Button,
  Image,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { ChevronsRight, Eye, FilePenLine, Plus, X } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImagePlaceholder from "../../assets/images/img-placeholder.png";
import { API_URL } from "../../axiosInstance";
import StatusSelect from "../../components/Select/StatusSelect";
import useDebounce from "../../hooks/useDebounce";
import useError from "../../hooks/useError";
import {
  deleteProduct,
  getProductList,
  setProductListParams,
} from "../../store/features/productSlice";
import AsyncSelect from "../../components/AsyncSelect";
const { Title } = Typography;

const Product = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { params, list, isLoading, paginationInfo } = useSelector(
    (state) => state.product,
  );
  const { user } = useSelector((state) => state.auth);
  const permissions = user.permission["product"];

  const debouncedSearch = useDebounce(params.search, 500);
  const debouncedName = useDebounce(params.name, 500);

  useEffect(() => {
    dispatch(getProductList(params)).unwrap().catch(handleError);
  }, [
    params.page,
    params.limit,
    params.sort_column,
    params.sort_direction,
    params.status,
    params.product_category_id,
    debouncedSearch,
    debouncedName,
  ]);

  const onConfirm = async (id) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success("Product deleted successfully");
      await dispatch(getProductList(params)).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      width: 120,
      render: (_, { image_url }) => (
        <div className="h-16 w-16 overflow-hidden rounded-md">
          <Image
            className="h-full w-full"
            title="image"
            src={
              image_url ? `${API_URL}/public/${image_url}` : ImagePlaceholder
            }
            fallback={ImagePlaceholder}
          />
        </div>
      ),
    },
    {
      title: (
        <div>
          <p>Name</p>
          <Input
            className="font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            value={params.name}
            onChange={(e) => {
              dispatch(
                setProductListParams({
                  ...params,
                  name: e.target.value,
                }),
              );
            }}
          />
        </div>
      ),
      dataIndex: "name",
      width: 200,
      sorter: true,
    },
    {
      title: (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Category</p>
          <AsyncSelect
            endpoint="/product-category"
            valueKey="id"
            labelKey="name"
            size="small"
            className="w-full font-normal"
            value={params.product_category_id}
            onChange={(value) =>
              dispatch(setProductListParams({ product_category_id: value }))
            }
          />
        </div>
      ),
      dataIndex: "product_category",
      width: 160,
      sorter: true,
    },
    {
      title: (
        <div>
          <p>Status</p>
          <StatusSelect
            className="w-full font-normal"
            size="small"
            onClick={(e) => e.stopPropagation()}
            allowClear
            value={params.status}
            onChange={(selected) => {
              dispatch(
                setProductListParams({
                  ...params,
                  status: selected,
                }),
              );
            }}
          />
        </div>
      ),
      dataIndex: "status",
      width: 140,
      sorter: true,
      render: (_, { status }) =>
        status ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 100,
      fixed: "right",
      render: (_, { id }) => (
        <Space>
          <Tooltip title="View">
            <Link to={`/product/view/${id}`}>
              <Button
                type="text"
                icon={<Eye size={16} />}
                className="text-gray-600"
                size="small"
              />
            </Link>
          </Tooltip>
          {permissions.edit ? (
            <Tooltip title="Edit">
              <Link to={`/product/edit/${id}`}>
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
              title="Delete the product"
              description="Are you sure to delete this product?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => onConfirm(id)}
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
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>PRODUCT LIST</Title>
        <Breadcrumb
          items={[
            {
              title: "Product",
            },
            {
              title: "List",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="min-h-96 rounded-lg bg-white p-2 sm:p-4">
        <div className="flex justify-between gap-2">
          <Input
            placeholder="Search Here..."
            className="mb-4 w-52"
            value={params.search}
            onChange={(e) =>
              dispatch(
                setProductListParams({
                  ...params,
                  search: e.target.value,
                }),
              )
            }
          />
          {permissions.add ? (
            <Link to="/product/create">
              <Button
                type="primary"
                icon={<Plus className="h-5 w-5" />}
                className="mb-2 sm:mb-0"
              >
                Add Product
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>

        <Table
          columns={columns}
          showSorterTooltip={false}
          dataSource={list}
          loading={isLoading}
          rowKey={"id"}
          size="small"
          scroll={{ y: 240, x: "calc(100% - 200px)" }}
          pagination={{
            total: paginationInfo.total_records,
            pageSize: params.limit,
            current: params.page,
            showTotal: (total) => `Total ${total} products`,
          }}
          onChange={(e, b, c, d) => {
            dispatch(
              setProductListParams({
                ...params,
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

export default Product;
