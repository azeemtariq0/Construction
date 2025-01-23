import { Breadcrumb, Tabs, Typography } from "antd";
import { ChevronsRight, Package, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProductForm from "../../components/Forms/ProductForm";
import VariantsTable from "../../components/Tables/VariantsTable";
import useError from "../../hooks/useError";
import { getProduct } from "../../store/features/productSlice";
const { Title } = Typography;

const ViewProduct = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector(
    (state) => state.product,
  );
  const [activeKey, setActiveKey] = useState("1");

  useEffect(() => {
    if (initialFormValues) return;
    dispatch(getProduct(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>VIEW PRODUCT</Title>
        <Breadcrumb
          items={[
            {
              title: "Product",
            },
            {
              title: "View",
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
                children: <ProductForm mode="view" />,
              },
              {
                key: "2",
                label: (
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} />
                    <span>Variants</span>
                  </div>
                ),
                children: <VariantsTable mode="view" />,
              },
            ]}
          />
        </div>
      ) : null}
    </>
  );
};

export default ViewProduct;
