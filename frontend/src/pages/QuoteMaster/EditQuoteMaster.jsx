import { Breadcrumb, Typography } from "antd";
import { ChevronsRight } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import QuoteMasterForm from "../../components/Forms/QuoteMasterForm";
import useError from "../../hooks/useError";
import {
  getQuoteMaster,
  updateQuoteMaster,
} from "../../store/features/quoteMasterSlice";
const { Title } = Typography;

const EditQuoteMaster = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector(
    (state) => state.quoteMaster,
  );

  const onRecordUpdate = async (data) => {
    try {
      await dispatch(updateQuoteMaster({ id, data })).unwrap();
      toast.success("Record updated successfully");
      navigate("/quote-master");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getQuoteMaster(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex justify-between gap-2">
        <Title level={4}>EDIT QUOTE MASTER</Title>
        <Breadcrumb
          items={[
            {
              title: "Quote Master",
            },
            {
              title: "Edit",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      {isItemLoading && (
        <div className="flex min-h-96 items-center justify-center">
          <ThreeDots color="#ce0105" />
        </div>
      )}

      {!isItemLoading && initialFormValues ? (
        <div className="mt-2 min-h-96 rounded-lg bg-white p-6">
          <QuoteMasterForm mode="edit" onSubmit={onRecordUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditQuoteMaster;
