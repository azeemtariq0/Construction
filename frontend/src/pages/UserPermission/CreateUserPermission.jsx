import { Breadcrumb, Typography } from "antd";
import { ChevronsRight } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserPermissionForm from "../../components/Forms/UserPermissionForm";
import useError from "../../hooks/useError";
import {
  createUserPermission,
  getUserPermissionForm,
} from "../../store/features/userPermissionSlice";

const { Title } = Typography;

const CreateUserPermission = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const navigate = useNavigate();

  const { isFormLoading, permissionsGroup } = useSelector(
    (state) => state.userPermission,
  );

  const onUpdatePermissionGroup = (values) => {
    dispatch(createUserPermission({ ...values, permission: permissionsGroup }))
      .unwrap()
      .then(() => {
        toast.success("User permission created successfully");
        navigate("/user-permission");
      })
      .catch(handleError);
  };

  useEffect(() => {
    dispatch(getUserPermissionForm()).unwrap().catch(handleError);
  }, []);

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>CREATE USER PERMISSION</Title>
        <Breadcrumb
          items={[
            {
              title: "User Permission",
            },
            {
              title: "Add",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      {isFormLoading ? (
        <div className="flex min-h-96 items-center justify-center">
          <ThreeDots color="#ce0105" />
        </div>
      ) : (
        <div className="mt-2 min-h-96 rounded-lg bg-white p-6">
          <UserPermissionForm onSubmit={onUpdatePermissionGroup} />
        </div>
      )}
    </>
  );
};
export default CreateUserPermission;
