import { Breadcrumb, Typography } from "antd";
import { ChevronsRight } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AttributeForm from "../../components/Forms/AttributeForm";
import useError from "../../hooks/useError";
import {
  getAttribute,
  updateAttribute,
} from "../../store/features/attributeSlice";
const { Title } = Typography;

const EditAttribute = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector(
    (state) => state.attribute,
  );

  const onAttributeUpdate = async (data) => {
    try {
      await dispatch(updateAttribute({ id, data })).unwrap();
      toast.success("Attribute updated successfully");
      navigate("/attribute");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getAttribute(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex justify-between gap-2">
        <Title level={4}>EDIT ATTRIBUTE</Title>
        <Breadcrumb
          items={[
            {
              title: "Attribute",
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
          <AttributeForm mode="edit" onSubmit={onAttributeUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditAttribute;
