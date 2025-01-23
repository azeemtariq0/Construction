import { Breadcrumb, Typography } from "antd";
import { ChevronsRight } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import UserPermissionForm from "../../components/Forms/UserPermissionForm";
import useError from "../../hooks/useError";
import {
  getUserPermission,
  updateUserPermission,
} from "../../store/features/userPermissionSlice";

const { Title } = Typography;

const EditUserPermission = () => {
  const dispatch = useDispatch();
  const handleError = useError();
  const navigate = useNavigate();

  const { id } = useParams();
  const { isFormLoading, permissionsGroup } = useSelector(
    (state) => state.userPermission,
  );

  useEffect(() => {
    dispatch(getUserPermission(id)).unwrap().catch(handleError);
  }, [id]);

  const onUpdatePermissionGroup = (values) => {
    dispatch(
      updateUserPermission({
        id,
        data: { ...values, permission: permissionsGroup },
      }),
    )
      .unwrap()
      .then(() => {
        toast.success("User permission updated successfully");
        navigate("/user-permission");
      })
      .catch(handleError);
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>EDIT USER PERMISSION</Title>
        <Breadcrumb
          items={[
            {
              title: "User Permission",
            },
            {
              title: "Edit",
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
          <UserPermissionForm mode="edit" onSubmit={onUpdatePermissionGroup} />
        </div>
      )}
    </>
  );
};
export default EditUserPermission;
