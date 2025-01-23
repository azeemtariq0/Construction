import { Breadcrumb, Typography } from "antd";
import { ChevronsRight } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import UserForm from "../../components/Forms/UserForm";
import useError from "../../hooks/useError";
import { getUser, updateUser } from "../../store/features/userSlice";
const { Title } = Typography;

const EditUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useError();
  const { id } = useParams();
  const { isItemLoading, initialFormValues } = useSelector(
    (state) => state.user,
  );

  const onUserUpdate = async (data) => {
    try {
      await dispatch(updateUser({ id, data })).unwrap();
      toast.success("User updated successfully");
      navigate("/user-management");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(getUser(id)).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex justify-between gap-2">
        <Title level={4}>EDIT USER</Title>
        <Breadcrumb
          items={[
            {
              title: "User Management",
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
          <UserForm mode="edit" onSubmit={onUserUpdate} />
        </div>
      ) : null}
    </>
  );
};

export default EditUser;
