import { Breadcrumb, Typography } from "antd";
import { ChevronsRight } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AttributeForm from "../../components/Forms/AttributeForm";
import useError from "../../hooks/useError";
import { createAttribute } from "../../store/features/attributeSlice";
const { Title } = Typography;

const CreateAttribute = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onAttributeCreate = async (data) => {
    try {
      await dispatch(createAttribute(data)).unwrap();
      toast.success("Attribute created successfully");
      navigate("/attribute");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>ADD ATTRIBUTE</Title>
        <Breadcrumb
          items={[
            {
              title: "Attribute",
            },
            {
              title: "Add",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="mt-2 w-full rounded-lg bg-white p-6 sm:w-2/4">
        <AttributeForm onSubmit={onAttributeCreate} />
      </div>
    </>
  );
};

export default CreateAttribute;
