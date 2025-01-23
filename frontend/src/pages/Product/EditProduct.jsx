import { Breadcrumb, Tabs, Typography } from "antd";
import { ChevronsRight, Package, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../components/Forms/ProductForm";
import useError from "../../hooks/useError";
import { getProduct, updateProduct } from "../../store/features/productSlice";
import VariantsTable from "../../components/Tables/VariantsTable";
const { Title } = Typography;

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector(
    (state) => state.product,
  );
  const [activeKey, setActiveKey] = useState("1");

  const onProductUpdate = async (data) => {
    try {
      await dispatch(updateProduct({ id, data })).unwrap();
      toast.success("Product updated successfully");
      setActiveKey("2");
    } catch (error) {
      handleError(error);
    }
  };

  const onVariantsSubmit = async (payload) => {
    try {
      await dispatch(updateProduct({ id, data: payload })).unwrap();

      if (payload.is_published) {
        toast.success("Product published successfully");
      } else {
        toast.success("Variants updated successfully");
      }

      navigate("/product");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (initialFormValues) return;
    dispatch(getProduct(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>EDIT PRODUCT</Title>
        <Breadcrumb
          items={[
            {
              title: "Product",
            },
            {
              title: "Edit",
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

      {!isItemLoading && initialFormValues ? (
        <div className="min-h-96 rounded-lg bg-white">
          <Tabs
            tabBarStyle={{
              padding: "0 20px",
            }}
            activeKey={activeKey}
            onChange={(key) => setActiveKey(key)}
            items={[
              {
                key: "1",
                label: (
                  <div className="flex items-center gap-2">
                    <Package size={16} />
                    <span>Product</span>
                  </div>
                ),
                children: (
                  <ProductForm mode="edit" onSubmit={onProductUpdate} />
                ),
              },
              {
                key: "2",
                label: (
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} />
                    <span>Variants</span>
                  </div>
                ),
                children: <VariantsTable onSubmit={onVariantsSubmit} />,
              },
            ]}
          />
        </div>
      ) : null}
    </>
  );
};

export default EditProduct;
