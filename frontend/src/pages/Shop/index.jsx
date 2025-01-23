import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Typography,
} from "antd";
import { ChevronsRight, FilterIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AsyncSelect from "../../components/AsyncSelect";
import FavoriteButton from "../../components/Button/FavoriteButton";
import ShopCard from "../../components/Cards/ShopCard";
import useDebounce from "../../hooks/useDebounce";
import useError from "../../hooks/useError";
import { getShopList, setShopListParams } from "../../store/features/shopSlice";
const { Title } = Typography;

const sortingOptions = [
  {
    value: "products.name-asc",
    label: "Name: A to Z",
  },
  {
    value: "products.name-desc",
    label: "Name: Z to A",
  },
  {
    value: "products.created_at-desc",
    label: "Date: New to Old",
  },
  {
    value: "products.created_at-asc",
    label: "Date: Old to New",
  },
];

const Shop = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const [form] = Form.useForm();
  const [filtersAreVisible, setFiltersAreVisible] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { isLoading, list, params, totalRecords } = useSelector(
    (state) => state.shop,
  );

  const debouncedSearch = useDebounce(params.search, 500);

  const toggleFilters = () => {
    setFiltersAreVisible((prevState) => !prevState);
  };

  const handleFiltersApply = ({ product_category_id, label_tags }) => {
    dispatch(
      setShopListParams({
        ...params,
        product_category_id,
        label_tags,
      }),
    );
    setFiltersAreVisible(false);
  };

  const handleFiltersReset = () => {
    form.resetFields();
    dispatch(
      setShopListParams({
        ...params,
        product_category_id: null,
        label_tags: "",
      }),
    );
    setFiltersAreVisible(false);
  };

  useEffect(() => {
    dispatch(
      getShopList({
        search: params.search,
        favorite: params.favorite,
        label_tags: params.label_tags,
        page: params.page,
        limit: params.limit,
        user_id: user.user_id,
        product_category_id: params.product_category_id
          ? params.product_category_id.value
          : null,
        sort_column: params.sort_by ? params.sort_by.split("-")[0] : null,
        sort_direction: params.sort_by ? params.sort_by.split("-")[1] : null,
      }),
    )
      .unwrap()
      .catch(handleError);
  }, [
    debouncedSearch,
    params.favorite,
    params.page,
    params.product_category_id,
    params.label_tags,
    params.sort_by,
    params.limit,
  ]);

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>SHOP</Title>
        <Breadcrumb
          items={[
            {
              title: "Shop",
            },
            {
              title: "List",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="min-h-96 rounded-lg bg-white p-4">
        <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Input
            placeholder="Search..."
            allowClear
            className="w-full sm:w-80"
            value={params.search}
            onChange={(e) =>
              dispatch(setShopListParams({ ...params, search: e.target.value }))
            }
          />
          <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
            <Button icon={<FilterIcon size={16} />} onClick={toggleFilters}>
              Filters
            </Button>
            <div className="flex items-center gap-4">
              <FavoriteButton
                tooltip={params.favorite ? "Show all" : "Show favorites"}
                isSelected={params.favorite}
                onClick={() =>
                  dispatch(
                    setShopListParams({
                      ...params,
                      favorite: params.favorite ? 0 : 1,
                    }),
                  )
                }
              />
              <Select
                placeholder="Sort by..."
                className="min-w-44"
                options={sortingOptions}
                allowClear
                value={params.sort_by}
                onChange={(value) =>
                  dispatch(
                    setShopListParams({
                      ...params,
                      sort_by: value,
                    }),
                  )
                }
              />
            </div>
          </div>
        </div>

        {!isLoading && list.length === 0 && (
          <div className="flex h-80 w-full items-center justify-center text-lg">
            <p>No products found</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex h-80 w-full items-center justify-center">
            <ThreeDots color="#ce0105" />
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {list.map((item) => (
              <Col span={24} lg={6} md={6} sm={12} key={item.id}>
                <Link to={`/shop/${item.id}`}>
                  <ShopCard
                    id={item.id}
                    image={item.image_url}
                    name={item.name}
                    summary={item.summary}
                    favorite={item.favorite}
                  />
                </Link>
              </Col>
            ))}
          </Row>
        )}

        <div className="my-4 mt-8 flex justify-center">
          <Pagination
            defaultCurrent={1}
            pageSize={9}
            total={totalRecords}
            current={params.page}
            onChange={(page) =>
              dispatch(setShopListParams({ ...params, page }))
            }
          />
        </div>
      </div>

      <Modal
        open={filtersAreVisible}
        okText="Apply"
        title="Filters"
        footer={null}
        onCancel={toggleFilters}
      >
        <Form
          layout="vertical"
          onFinish={handleFiltersApply}
          form={form}
          initialValues={{
            product_category_id: params.product_category_id,
            label_tags: params.label_tags,
          }}
        >
          <Form.Item name="product_category_id" label="Category">
            <AsyncSelect
              endpoint="/product-category"
              valueKey="id"
              labelKey="name"
              labelInValue
            />
          </Form.Item>

          <Form.Item name="label_tags" label="Tag / Label">
            <Input />
          </Form.Item>

          <div className="flex justify-end gap-4">
            <Button htmlType="reset" onClick={handleFiltersReset}>
              Reset
            </Button>
            <Button type="primary" htmlType="submit">
              Apply
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default Shop;
