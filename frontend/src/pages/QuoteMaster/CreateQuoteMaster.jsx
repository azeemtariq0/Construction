import { Breadcrumb, Typography } from "antd";
import { ChevronsRight } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import QuoteMasterForm from "../../components/Forms/QuoteMasterForm";
import useError from "../../hooks/useError";
import { createQuoteMaster } from "../../store/features/quoteMasterSlice";
const { Title } = Typography;

const CreateQuoteMaster = () => {
  const handleError = useError();
  const dispatch = useDispatch();

  const onRecordCreate = async (data) => {
    try {
      await dispatch(createQuoteMaster(data)).unwrap();
      toast.success("Record created successfully");
      return true;
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>CREATE QUOTE MASTER</Title>
        <Breadcrumb
          items={[
            {
              title: "Quote Master",
            },
            {
              title: "Add",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="mt-2 min-h-96 rounded-lg bg-white p-6">
        <QuoteMasterForm onSubmit={onRecordCreate} />
      </div>
    </>
  );
};

export default CreateQuoteMaster;
