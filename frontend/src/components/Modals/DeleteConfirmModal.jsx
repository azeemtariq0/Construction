import { Button, Modal } from "antd";
import { CircleAlert } from "lucide-react";

const DeleteConfirmModal = ({
  open,
  onCancel,
  title = "Are you sure you want to delete?",
  description = "After deleting, you will not be able to recover it.",
  onDelete,
  isDeleting = false,
}) => {
  return (
    <Modal open={open} onCancel={onCancel} footer={null} closable={false}>
      <div className="flex flex-col items-center justify-center">
        <CircleAlert size={80} className="mb-4 text-red-500" />
        <h4 className="text-center text-lg font-semibold">{title}</h4>
        {description && <p className="text-center">{description}</p>}

        <div className="mt-6 flex items-center justify-center gap-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" danger onClick={onDelete} loading={isDeleting}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
