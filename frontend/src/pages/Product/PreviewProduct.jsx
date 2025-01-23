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
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import FavoriteButton from "../../components/Button/FavoriteButton";
const { Paragraph, Text } = Typography;

const ViewShopItem = () => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const { variantList, initialFormValues, variantAttributes } = useSelector(
    (state) => state.product,
  );

  const handleThumbnailClick = (index) => {
    if (carouselRef.current) {
      carouselRef.current.goTo(index);
    }
  };

  const handlePreview = async (image) => {
    setPreviewImage(image);
    setPreviewOpen(true);
  };

  const attributeColumns = variantAttributes.length
    ? variantAttributes.map((attribute) => {
        return {
          title: attribute.attribute_name,
          dataIndex: attribute.attribute_id,
          width: 100,
        };
      })
    : [];

  const variantColumns = [
    {
      title: "Part No",
      dataIndex: "part_no",
      width: 100,
    },
    ...attributeColumns,
    {
      title: "Price",
      dataIndex: "price",
      width: 100,
    },
    {
      title: "Qty",
      dataIndex: "action",
      fixed: "right",
      render: () => (
        <div className="flex items-center gap-2">
          <Button icon={<Minus size={12} />} size="small" />
          <p className="rounded border border-gray-400 bg-white px-2 py-[3px] text-xs text-gray-600">
            1
          </p>
          <Button icon={<Plus size={12} />} size="small" />
        </div>
      ),
    },
  ];

  if (!initialFormValues) {
    return <Navigate to="/product" />;
  }

  const dataSource = variantList.map((variant) => {
    const columnsAndValues = {};

    variant.attributes.forEach((attribute) => {
      columnsAndValues[attribute.attribute_id] = attribute.value;
    });

    return {
      ...columnsAndValues,
      key: variant.id,
    };
  });

  return (
    <div>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>PRODUCT PREVIEW</Title>
        <Breadcrumb
          items={[
            {
              title: "Product",
            },
            {
              title: "Product Preview",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="relative min-h-96 rounded-lg bg-white p-8">
        <div
          className="absolute right-2 top-2 z-10 cursor-pointer rounded-md border border-gray-300 bg-gray-300 p-2 transition-all hover:bg-gray-200"
          onClick={() => navigate(-1)}
        >
          Close Preview
        </div>
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
          <div className="w-full lg:w-80">
            <Carousel
              arrows
              dots={false}
              className="overflow-hidden rounded-lg bg-white"
              ref={carouselRef}
            >
              {initialFormValues.images.map((img) => (
                <div className="m-0 h-64 w-full" key={img.name}>
                  <img
                    className="h-full w-full cursor-pointer object-contain object-center"
                    src={img?.url || img.thumbUrl}
                    alt={img.name}
                    onClick={() => handlePreview(img?.url || img.thumbUrl)}
                  />
                </div>
              ))}
            </Carousel>

            <div className="my-2 flex flex-wrap items-center gap-2">
              {initialFormValues.images.map((img, i) => (
                <div
                  className="h-[74px] w-[74px] cursor-pointer overflow-hidden rounded-md border border-gray-200 hover:opacity-80"
                  key={img.name}
                  onClick={() => handleThumbnailClick(i)}
                >
                  <img
                    className="h-full w-full object-cover"
                    title="image"
                    src={img?.url || img.thumbUrl}
                    alt={img.name}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-center gap-4">
              <Tooltip title="Back to shop">
                <Button icon={<ArrowLeft size={16} />} className="mb-[14px]" />
              </Tooltip>
              <Title level={2}>{initialFormValues.name}</Title>
            </div>
            <Text className="text-sm text-gray-500">
              Category: {initialFormValues.category.label}
            </Text>
            <div className="my-2">
              <span className="mr-2 text-sm text-gray-500">Tags:</span>
              {initialFormValues.tags
                ? initialFormValues.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))
                : null}
            </div>

            <h5 className="mb-2 mt-4 text-base font-semibold">Variants</h5>

            <Table
              columns={variantColumns}
              dataSource={variantAttributes.length ? dataSource : []}
              scroll={{ x: true }}
              pagination={false}
              className="w-full"
              size="small"
              rowKey="id"
              rowHoverable={false}
              rowSelection={{
                type: "checkbox",
              }}
            />

            <div className="mt-4 flex gap-2">
              <FavoriteButton size="large" />
              <Button
                type="primary"
                icon={<ShoppingCart size={22} />}
                size="large"
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
            {initialFormValues.summary}
          </Paragraph>
          <Title level={4}>Product Details:</Title>
          <Paragraph className="text-sm text-gray-700">
            <div
              dangerouslySetInnerHTML={{
                __html: initialFormValues.productDetails,
              }}
            />
          </Paragraph>
        </div>
      </div>

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
