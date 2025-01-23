import { Breadcrumb, Typography } from "antd";
import { ChevronsRight } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ProductCategoryForm from "../../components/Forms/ProductCategoryForm";
import useError from "../../hooks/useError";
import {
  getProductCategory,
  updateProductCategory,
} from "../../store/features/productCategorySlice";
const { Title } = Typography;

const EditProductCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector(
    (state) => state.productCategory,
  );

  const onCategoryUpdate = async (data) => {
    try {
      await dispatch(updateProductCategory({ id, data })).unwrap();
      toast.success("Product category updated successfully");
      navigate("/product-category");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getProductCategory(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex justify-between gap-2">
        <Title level={4}>EDIT PRODUCT CATEGORY</Title>
        <Breadcrumb
          items={[
            {
              title: "Product Category",
            },
            {
              title: "Edit",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      {isItemLoading && (
        <div className="flex min-h-48 w-full items-center justify-center rounded-lg bg-white sm:w-2/4">
          <ThreeDots color="#ce0105" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-2 w-full rounded-lg bg-white p-6 sm:w-2/4">
          <ProductCategoryForm mode="edit" onSubmit={onCategoryUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditProductCategory;
