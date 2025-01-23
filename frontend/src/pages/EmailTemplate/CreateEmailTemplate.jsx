import { Breadcrumb, Typography } from "antd";
import { ChevronsRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import EmailTemplateForm from "../../components/Forms/EmailTemplateForm";
import useError from "../../hooks/useError";
import { createEmailTemplate } from "../../store/features/emailTemplateSlice";
import toast from "react-hot-toast";
const { Title } = Typography;

const CreateEmailTemplate = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const navigate = useNavigate();

  const onEmailTemplateCreate = async (values) => {
    try {
      await dispatch(createEmailTemplate(values)).unwrap();
      toast.success("Email Template created successfully");
      navigate("/email-template");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>CREATE EMAIL TEMPLATE</Title>
        <Breadcrumb
          items={[
            {
              title: "Email Template",
            },
            {
              title: "Create",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="mt-2 min-h-96 rounded-lg bg-white p-6">
        <EmailTemplateForm onSubmit={onEmailTemplateCreate} />
      </div>
    </>
  );
};

export default CreateEmailTemplate;
