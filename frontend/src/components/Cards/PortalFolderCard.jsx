import { Dropdown, Input } from "antd";
import {
  EllipsisVertical,
  Folder,
  Folders,
  PencilLine,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import { useDispatch, useSelector } from "react-redux";
import useError from "../../hooks/useError";
import {
  deleteFolderOrFile,
  renameFolder,
  setFolderSearch,
} from "../../store/features/portalSlice";
import toast from "react-hot-toast";

const PortalFolderCard = ({
  title,
  id: folderId,
  hasSubFolders,
  isNew = false,
}) => {
  const dispatch = useDispatch();
  const handleError = useError();

  const { user } = useSelector((state) => state.auth);
  const { folders, isFolderOrFileDeleting } = useSelector(
    (state) => state.portal,
  );
  const permission = user.permission.portal;

  const [isRenameInputVisible, setIsRenameInputVisible] = useState(isNew);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const onRename = async (e) => {
    const value = e.target.value.trim();

    if (value === title || !value) return setIsRenameInputVisible(false);

    const isAlreadyExist = folders.some(
      (folder) => folder.folder_name === value,
    );
    if (isAlreadyExist) return toast.error("Folder name already exist");

    setIsRenameInputVisible(false);
    try {
      await dispatch(
        renameFolder({
          id: folderId,
          data: { name: e.target.value, user_id: user.user_id },
        }),
      ).unwrap();
      toast.success("Folder renamed successfully");
    } catch (error) {
      handleError();
    }
  };
  const closeDeleteModal = () => setIsDeleteModalVisible(null);

  const onFolderDelete = async () => {
    try {
      await dispatch(
        deleteFolderOrFile({ id: folderId, params: { file_type: "F" } }),
      ).unwrap();
      closeDeleteModal();
      toast.success("Folder deleted successfully");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div
        className={`cursor-pointer rounded-lg ${isRenameInputVisible ? "bg-purple-200 hover:bg-purple-300" : "bg-gray-100 hover:bg-gray-200"} p-2 transition-all`}
      >
        <Link
          to={`?folder=${folderId}`}
          onClick={() => dispatch(setFolderSearch(""))}
        >
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2 overflow-hidden text-black">
              <div>
                {hasSubFolders ? (
                  <Folders
                    size={20}
                    stroke="#FFD970"
                    fill="#FFD970"
                    fillOpacity={0.6}
                  />
                ) : (
                  <Folder size={20} fill="#FFD970" stroke="#FFD970" />
                )}
              </div>
              {isRenameInputVisible ? (
                <Input
                  placeholder="Folder Name"
                  className="w-full rounded-sm border-none"
                  size="small"
                  defaultValue={title}
                  autoFocus
                  onBlur={onRename}
                  onPressEnter={onRename}
                  onFocus={(e) => e.target.select()}
                  onClick={(e) => e.preventDefault()}
                />
              ) : (
                <div className="overflow-hidden text-ellipsis text-nowrap font-medium">
                  {title}
                </div>
              )}
            </div>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "rename",
                    label: "Rename",
                    hide: !permission.edit,
                    icon: <PencilLine size={14} />,
                    onClick: (e) => {
                      e.domEvent.preventDefault();
                      setIsRenameInputVisible(true);
                    },
                  },
                  {
                    key: "delete",
                    label: "Delete",
                    icon: <Trash2 size={14} />,
                    danger: true,
                    hide: !permission.delete,
                    onClick: (e) => {
                      e.domEvent.preventDefault();
                      setIsDeleteModalVisible(true);
                    },
                  },
                ].filter((item) => !item.hide),
              }}
              trigger={["click"]}
            >
              <div
                className="cursor-pointer rounded py-1 hover:bg-gray-300"
                onClick={(e) => e.preventDefault()}
              >
                <EllipsisVertical size={18} className="text-gray-600" />
              </div>
            </Dropdown>
          </div>
        </Link>
      </div>
      <DeleteConfirmModal
        open={isDeleteModalVisible ? true : false}
        onCancel={closeDeleteModal}
        onDelete={onFolderDelete}
        isDeleting={isFolderOrFileDeleting}
        title={`Are you sure you want to delete this folder?`}
      />
    </>
  );
};

export default PortalFolderCard;
