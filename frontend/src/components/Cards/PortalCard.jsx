import { Button, Dropdown, Form, Input, Modal } from "antd";
import { EllipsisVertical, FolderPen, PencilLine, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useError from "../../hooks/useError";
import { deletePortal, updatePortal } from "../../store/features/portalSlice";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";

const PortalCard = ({ title, id }) => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { portalList, isPortalFormSubmitting } = useSelector(
    (state) => state.portal,
  );

  const { user } = useSelector((state) => state.auth);
  const permission = user.permission.portal;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(null);

  const closeDeleteModal = () => setDeleteModalIsOpen(null);
  const closeEditModal = () => setEditModalIsOpen(null);

  const onPortalUpdate = async (values) => {
    try {
      await dispatch(
        updatePortal({
          id,
          data: values,
        }),
      ).unwrap();
      closeEditModal();
      toast.success("Portal updated successfully.");
    } catch (error) {
      handleError(error);
    }
  };

  const onPortalDelete = async () => {
    try {
      await dispatch(deletePortal(id)).unwrap();
      closeDeleteModal();
      toast.success("Portal deleted successfully.");
    } catch (error) {
      handleError(error);
    }
  };

  const getInitialValues = () => {
    const portal =
      portalList.length > 0 ? portalList.find((p) => p.id === id) : null;
    return portal
      ? { name: portal.name, description: portal.description }
      : null;
  };

  return (
    <div className="cursor-pointer rounded-lg bg-slate-100 p-2 transition-all hover:bg-slate-200">
      <Link to={permission.view ? `/portal/${id}` : "#"}>
        <div className="flex items-center justify-between pb-1">
          <div className="overflow-hidden text-ellipsis text-nowrap text-base font-medium text-black">
            {title}
          </div>
          <Dropdown
            menu={{
              items: [
                {
                  key: "update",
                  label: "Update",
                  hide: !permission.edit,
                  icon: <PencilLine size={14} />,
                  onClick: (e) => {
                    e.domEvent.preventDefault();
                    setEditModalIsOpen(true);
                  },
                },
                {
                  key: "delete",
                  danger: true,
                  label: "Delete",
                  hide: !permission.delete,
                  icon: <Trash2 size={14} />,
                  onClick: (e) => {
                    e.domEvent.preventDefault();
                    setDeleteModalIsOpen(true);
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

        <div className="flex items-center justify-center rounded-md bg-white py-8">
          <FolderPen size={80} className="text-gray-200" strokeWidth={1} />
        </div>
      </Link>

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        onDelete={onPortalDelete}
        title="Are you sure you want to delete this portal?"
        description="After deleting, you will not be able to recover it."
        isDeleting={isPortalFormSubmitting}
      />

      <Modal
        title="Update Portal"
        open={editModalIsOpen ? true : false}
        onCancel={closeEditModal}
        footer={null}
      >
        <Form
          layout="vertical"
          autoComplete="off"
          initialValues={getInitialValues()}
          onFinish={onPortalUpdate}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, whitespace: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, whitespace: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <div className="flex items-center justify-end gap-2">
            <Button htmlType="reset" onClick={closeEditModal} className="w-20">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="w-20"
              loading={isPortalFormSubmitting}
            >
              Update
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PortalCard;
