import { Breadcrumb, Tabs, Typography } from "antd";
import { ChevronsRight, Package, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/Forms/ProductForm";
import VariantsTable from "../../components/Tables/VariantsTable";
import useError from "../../hooks/useError";
import {
  createProduct,
  updateProduct,
} from "../../store/features/productSlice";
const { Title } = Typography;

const CreateProduct = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();
  const { createdProductID } = useSelector((state) => state.product);
  const [activeKey, setActiveKey] = useState(createdProductID ? "2" : "1");

  const onProductCreate = async (data) => {
    try {
      await dispatch(createProduct(data)).unwrap();
      toast.success("Product created successfully");
      setActiveKey("2");
    } catch (error) {
      handleError(error);
    }
  };

  const onVariantsSubmit = async (payload) => {
    try {
      await dispatch(
        updateProduct({ id: createdProductID, data: payload }),
      ).unwrap();

      if (payload.is_published) {
        toast.success("Product published successfully");
      } else {
        toast.success("Variants created successfully");
      }

      navigate("/product");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>CREATE PRODUCT</Title>
        <Breadcrumb
          items={[
            {
              title: "Product",
            },

            {
              title: "Add",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="min-h-96 rounded-lg bg-white">
        <Tabs
          tabBarStyle={{
            padding: "0 20px",
          }}
          activeKey={activeKey}
          items={[
            {
              key: "1",
              disabled: createdProductID,
              label: (
                <div className="flex items-center gap-2">
                  <Package size={16} />
                  <span>Product</span>
                </div>
              ),
              children: <ProductForm onSubmit={onProductCreate} />,
            },
            {
              key: "2",
              disabled: !createdProductID,
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
    </>
  );
};

export default CreateProduct;
