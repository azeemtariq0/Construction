import { Breadcrumb, Typography } from "antd";
import { ChevronsRight } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EmailTemplateForm from "../../components/Forms/EmailTemplateForm";
import useError from "../../hooks/useError";
import {
  getEmailTemplate,
  updateEmailTemplate,
} from "../../store/features/emailTemplateSlice";
const { Title } = Typography;

const EditEmailTemplate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector(
    (state) => state.emailTemplate,
  );

  const onEmailTemplateUpdate = async (data) => {
    try {
      await dispatch(updateEmailTemplate({ id, data })).unwrap();
      toast.success("Email Template updated successfully");
      navigate("/email-template");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getEmailTemplate(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>EDIT EMAIL TEMPLATE</Title>
        <Breadcrumb
          items={[
            {
              title: "Email Template",
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
        <div className="mt-2 min-h-96 rounded-lg bg-white p-6">
          <EmailTemplateForm mode="edit" onSubmit={onEmailTemplateUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditEmailTemplate;
