import { Breadcrumb, Typography } from "antd";
import { ChevronsRight } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductCategoryForm from "../../components/Forms/ProductCategoryForm";
import useError from "../../hooks/useError";
import { createProductCategory } from "../../store/features/productCategorySlice";
const { Title } = Typography;

const CreateProductCategory = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onCategoryCreate = async (data) => {
    try {
      await dispatch(createProductCategory(data)).unwrap();
      toast.success("Product category created successfully");
      navigate("/product-category");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>ADD PRODUCT CATEGORY</Title>
        <Breadcrumb
          items={[
            {
              title: "Product Category",
            },
            {
              title: "Add",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="mt-2 w-full rounded-lg bg-white p-6 sm:w-2/4">
        <ProductCategoryForm onSubmit={onCategoryCreate} />
      </div>
    </>
  );
};

export default CreateProductCategory;
