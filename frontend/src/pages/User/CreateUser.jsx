import { Breadcrumb, Typography } from "antd";
import { ChevronsRight } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserForm from "../../components/Forms/UserForm";
import useError from "../../hooks/useError";
import { createUser } from "../../store/features/userSlice";
const { Title } = Typography;

const CreateUser = () => {
  const navigate = useNavigate();
  const handleError = useError();
  const dispatch = useDispatch();

  const onUserCreate = async (data) => {
    try {
      await dispatch(createUser(data)).unwrap();
      toast.success("User created successfully");
      navigate("/user-management");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>ADD USER</Title>
        <Breadcrumb
          items={[
            {
              title: "User Management",
            },
            {
              title: "Add",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="mt-2 min-h-96 rounded-lg bg-white p-6">
        <UserForm onSubmit={onUserCreate} />
      </div>
    </>
  );
};

export default CreateUser;
