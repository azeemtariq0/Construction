import {
  Breadcrumb,
  Button,
  Carousel,
  Divider,
  Image,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import Title from "antd/es/typography/Title";
import {
  ArrowLeft,
  ChevronsRight,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../../axiosInstance";
import FavoriteButton from "../../components/Button/FavoriteButton";
import useError from "../../hooks/useError";
import { getNotificationList } from "../../store/features/notificationsSlice";
import {
  addToCart,
  addToFavorite,
  getShopItem,
} from "../../store/features/shopSlice";

const { Paragraph, Text } = Typography;

const ViewShopItem = () => {
  const carouselRef = useRef(null);
  const dispatch = useDispatch();
  const handleError = useError();
  const { id } = useParams();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const { user } = useSelector((state) => state.auth);
  const {
    shopItemDetails: details,
    isItemLoading,
    isAddingToCart,
  } = useSelector((state) => state.shop);

  const [selectedVariants, setSelectedVariants] = useState([]);

  const handleThumbnailClick = (index) => {
    if (carouselRef.current) {
      carouselRef.current.goTo(index);
    }
  };

  const handlePreview = async (image) => {
    setPreviewImage(image);
    setPreviewOpen(true);
  };

  const onAddToFavorite = async (favorite) => {
    try {
      await dispatch(
        addToFavorite({
          user_id: user.user_id,
          product_id: id,
          is_favorite: favorite ? 0 : 1,
        }),
      ).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const changeQuantity = (id, type = "add") => {
    const newSelectedVariants = [...selectedVariants];
    const index = newSelectedVariants.findIndex((v) => v.id === id);

    if (index === -1) return;

    if (type === "add") {
      newSelectedVariants[index].quantity += 1;
    } else if (type === "subtract" && newSelectedVariants[index].quantity > 1) {
      newSelectedVariants[index].quantity -= 1;
    }

    setSelectedVariants(newSelectedVariants);
  };

  const onAddToCart = async () => {
    try {
      const payload = {
        user_id: user.user_id,
        product_id: id,
        carts: selectedVariants,
      };
      await dispatch(addToCart(payload)).unwrap();
      setSelectedVariants([]);
      toast.success("Variants added to cart successfully");
      await dispatch(
        getNotificationList({
          user_id: user?.user_id,
          user_type: user.user_type,
        }),
      ).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const attributeColumns = details?.product_attributes
    ? details.product_attributes.map((attribute) => ({
        title: attribute.attribute_name,
        dataIndex: attribute.attribute_id,
        key: attribute.attribute_id,
      }))
    : [];
  const variantColumns = [
    {
      title: "Part No",
      dataIndex: "part_no",
      key: "part_no",
    },
    ...attributeColumns,
    {
      title: "Qty",
      dataIndex: "action",
      fixed: "right",
      render: (_, record) => {
        const { id } = record;
        const findVariant = selectedVariants.find((v) => v.id === id);
        if (!findVariant) return <div>-</div>;

        return (
          <div className="flex items-center gap-2">
            <Button
              icon={<Minus size={12} />}
              size="small"
              onClick={() => changeQuantity(id, "subtract")}
              disabled={findVariant.quantity <= 1}
            />
            <p className="rounded border border-gray-400 bg-white px-2 py-[3px] text-xs text-gray-600">
              {findVariant.quantity}
            </p>
            <Button
              icon={<Plus size={12} />}
              size="small"
              onClick={() => changeQuantity(id, "add")}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(getShopItem({ id, user_id: user.user_id }))
      .unwrap()
      .catch(handleError);
  }, []);

  const dataSource = details?.product_variant_attributes
    ? details.product_variant_attributes.map((variant) => {
        const properties = {};

        variant.forEach((item) => {
          properties[item.attribute_id] = item.attribute_value;
        });

        return {
          id: variant[0].variant_id,
          ...properties,
        };
      })
    : [];

  return (
    <div>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>PRODUCT DETAILS</Title>
        <Breadcrumb
          items={[
            {
              title: "Shop",
            },
            {
              title: "Product Details",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      {isItemLoading && (
        <div className="flex min-h-96 w-full items-center justify-center rounded-lg bg-white">
          <ThreeDots color="#ce0105" />
        </div>
      )}

      {!isItemLoading && details ? (
        <div className="min-h-96 rounded-lg bg-white p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
            <div className="w-full lg:w-80">
              <Carousel
                arrows
                dots={false}
                className="overflow-hidden rounded-lg bg-white"
                ref={carouselRef}
              >
                {details.images.map(({ path, image }) => (
                  <div className="m-0 h-64 w-full" key={image}>
                    <img
                      className="h-full w-full cursor-pointer object-contain object-center"
                      src={`${API_URL}/public/${path}${image}`}
                      alt={image}
                      onClick={() =>
                        handlePreview(`${API_URL}/public/${path}${image}`)
                      }
                    />
                  </div>
                ))}
              </Carousel>

              <div className="my-2 flex flex-wrap items-center gap-2">
                {details.images.map(({ path, image }, i) => (
                  <div
                    className="h-[74px] w-[74px] cursor-pointer overflow-hidden rounded-md border border-gray-200 hover:opacity-80"
                    key={image}
                    onClick={() => handleThumbnailClick(i)}
                  >
                    <img
                      className="h-full w-full object-cover"
                      title="image"
                      src={`${API_URL}/public/${path}${image}`}
                      alt={image}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-center gap-4">
                <Link to="/shop">
                  <Tooltip title="Back to shop">
                    <Button
                      icon={<ArrowLeft size={16} />}
                      className="mb-[14px]"
                    />
                  </Tooltip>
                </Link>
                <Title level={2}>{details.name}</Title>
              </div>
              <Text className="text-sm text-gray-500">
                Category: {details.product_category}
              </Text>
              <div className="my-2">
                <span className="mr-2 text-sm text-gray-500">Tags:</span>
                {details.label_tags
                  ? details.label_tags.split("_").map((tag) => (
                      <Tag key={tag} color="cyan">
                        {tag}
                      </Tag>
                    ))
                  : null}
              </div>

              <h5 className="mb-2 mt-4 text-base font-semibold">Variants</h5>

              <Table
                columns={variantColumns}
                dataSource={dataSource}
                scroll={{ x: true }}
                pagination={false}
                className="w-full"
                size="small"
                rowKey="id"
                rowHoverable={false}
                rowSelection={{
                  type: "checkbox",
                  selectedRowKeys: selectedVariants.map((v) => v.id),
                  onChange: (_, variants) => {
                    const newSelected = variants.map((v) => ({
                      id: v.id,
                      price: +v.price,
                      quantity:
                        selectedVariants.find((variant) => variant.id === v.id)
                          ?.quantity || 1,
                    }));
                    setSelectedVariants(newSelected);
                  },
                }}
              />

              <div className="mt-4 flex gap-2">
                <FavoriteButton
                  isSelected={details.favorite === 1}
                  size="large"
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToFavorite(details.favorite === 1);
                  }}
                />
                <Button
                  type="primary"
                  icon={<ShoppingCart size={22} />}
                  size="large"
                  disabled={selectedVariants.length === 0}
                  onClick={onAddToCart}
                  loading={isAddingToCart}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>

          <Divider className="my-4" />

          <div className="mt-4">
            <Title level={4}>Summary:</Title>
            <Paragraph className="w-full text-sm text-gray-700 lg:w-[80%]">
              {details.summary}
            </Paragraph>
            <Title level={4}>Product Details:</Title>
            <Paragraph className="text-sm text-gray-700">
              <div dangerouslySetInnerHTML={{ __html: details.description }} />
            </Paragraph>
          </div>
        </div>
      ) : null}

      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

export default ViewShopItem;
