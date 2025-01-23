import { Checkbox, Dropdown, Image } from "antd";
import dayjs from "dayjs";
import { Download, EllipsisVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useError from "../../hooks/useError";
import {
  addToSelectedFiles,
  deleteFolderOrFile,
  removeToSelectedFiles,
} from "../../store/features/portalSlice";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";

async function downloadFile(url, name) {
  fetch(url)
    .then((resp) => resp.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(() => alert("An error sorry"));
}

const FileIcon = ({ name, url }) => {
  const ext = name.split(".").pop().toLowerCase();

  if (ext === "xlsx") {
    return (
      <svg
        width="11"
        height="13"
        viewBox="0 0 13 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.4375 3.98438V0H1.57812C1.18848 0 0.875 0.313477 0.875 0.703125V14.2969C0.875 14.6865 1.18848 15 1.57812 15H11.4219C11.8115 15 12.125 14.6865 12.125 14.2969V4.6875H8.14062C7.75391 4.6875 7.4375 4.37109 7.4375 3.98438ZM9.19824 7.10449L7.4375 9.84375L9.19824 12.583C9.34766 12.8174 9.18066 13.125 8.90234 13.125H7.87988C7.75098 13.125 7.63086 13.0547 7.56934 12.9404C6.99512 11.8799 6.5 10.9277 6.5 10.9277C6.3125 11.3613 6.20703 11.5137 5.42773 12.9434C5.36621 13.0576 5.24902 13.1279 5.12012 13.1279H4.09766C3.81934 13.1279 3.65234 12.8203 3.80176 12.5859L5.56836 9.84668L3.80176 7.10742C3.64941 6.87305 3.81934 6.56543 4.09766 6.56543H5.11719C5.24609 6.56543 5.36621 6.63574 5.42773 6.75C6.19238 8.17969 6.01367 7.73438 6.5 8.75684C6.5 8.75684 6.67871 8.41406 7.57227 6.75C7.63379 6.63574 7.75391 6.56543 7.88281 6.56543H8.90234C9.18066 6.5625 9.34766 6.87012 9.19824 7.10449ZM12.125 3.57129V3.75H8.375V0H8.55371C8.74121 0 8.91992 0.0732422 9.05176 0.205078L11.9199 3.07617C12.0518 3.20801 12.125 3.38672 12.125 3.57129Z"
          fill="#148149"
        />
      </svg>
    );
  }

  if (ext === "docx") {
    return (
      <svg
        width="11"
        height="15"
        viewBox="0 0 13 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.01367 4.40332V0.15332H0.763672C0.348047 0.15332 0.0136719 0.487695 0.0136719 0.90332V15.4033C0.0136719 15.8189 0.348047 16.1533 0.763672 16.1533H11.2637C11.6793 16.1533 12.0137 15.8189 12.0137 15.4033V5.15332H7.76367C7.35117 5.15332 7.01367 4.81582 7.01367 4.40332ZM8.79805 8.15332H9.54492C9.78555 8.15332 9.96367 8.3752 9.91055 8.6127L8.72305 13.8627C8.68555 14.0346 8.53242 14.1533 8.35742 14.1533H7.16992C6.99805 14.1533 6.84805 14.0346 6.80742 13.8689C6.00117 10.6346 6.15742 11.3314 6.00742 10.4158H5.9918C5.95742 10.8627 5.9168 10.9596 5.1918 13.8689C5.15117 14.0346 5.00117 14.1533 4.8293 14.1533H3.66992C3.49492 14.1533 3.3418 14.0314 3.3043 13.8596L2.12305 8.60957C2.06992 8.3752 2.24805 8.15332 2.48867 8.15332H3.2543C3.43242 8.15332 3.58867 8.27832 3.62305 8.45645C4.11055 10.8939 4.25117 11.8783 4.2793 12.2752C4.3293 11.9564 4.50742 11.2533 5.19805 8.44082C5.23867 8.27207 5.38867 8.15645 5.56367 8.15645H6.47305C6.64805 8.15645 6.79805 8.2752 6.83867 8.44394C7.58867 11.5814 7.73867 12.3189 7.76367 12.4877C7.75742 12.1377 7.68242 11.9314 8.43867 8.4502C8.46992 8.2752 8.62305 8.15332 8.79805 8.15332ZM12.0137 3.9627V4.15332H8.01367V0.15332H8.2043C8.4043 0.15332 8.59492 0.231445 8.73555 0.37207L11.7949 3.43457C11.9355 3.5752 12.0137 3.76582 12.0137 3.9627Z"
          fill="#174594"
        />
      </svg>
    );
  }

  if (ext === "pdf") {
    return (
      <svg
        width="11"
        height="13"
        viewBox="0 0 13 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.2041 7.50293C6.05762 7.03418 6.06055 6.12891 6.14551 6.12891C6.3916 6.12891 6.36816 7.20996 6.2041 7.50293ZM6.1543 8.88574C5.92871 9.47754 5.64746 10.1543 5.32227 10.7227C5.8584 10.5176 6.46484 10.2188 7.16504 10.0811C6.79297 9.7998 6.43555 9.39551 6.1543 8.88574ZM3.39746 12.542C3.39746 12.5654 3.78418 12.3838 4.41992 11.3643C4.22363 11.5488 3.56738 12.082 3.39746 12.542ZM8.14062 4.6875H12.125V14.2969C12.125 14.6865 11.8115 15 11.4219 15H1.57812C1.18848 15 0.875 14.6865 0.875 14.2969V0.703125C0.875 0.313477 1.18848 0 1.57812 0H7.4375V3.98438C7.4375 4.37109 7.75391 4.6875 8.14062 4.6875ZM7.90625 9.7207C7.32031 9.36328 6.93066 8.87109 6.65527 8.14453C6.78711 7.60254 6.99512 6.7793 6.83691 6.26367C6.69922 5.40234 5.59473 5.4873 5.43652 6.06445C5.29004 6.60059 5.4248 7.35645 5.67383 8.32031C5.33398 9.12891 4.83301 10.2129 4.47852 10.834C4.47559 10.834 4.47559 10.8369 4.47266 10.8369C3.67871 11.2441 2.31641 12.1406 2.87598 12.8291C3.04004 13.0312 3.34473 13.1221 3.50586 13.1221C4.03027 13.1221 4.55176 12.5947 5.2959 11.3115C6.05176 11.0625 6.88086 10.752 7.61035 10.6318C8.24609 10.9775 8.99023 11.2031 9.48535 11.2031C10.3408 11.2031 10.3994 10.2656 10.0625 9.93164C9.65527 9.5332 8.47168 9.64746 7.90625 9.7207ZM11.9199 3.07617L9.04883 0.205078C8.91699 0.0732422 8.73828 0 8.55078 0H8.375V3.75H12.125V3.57129C12.125 3.38672 12.0518 3.20801 11.9199 3.07617ZM9.74902 10.5557C9.86914 10.4766 9.67578 10.207 8.49512 10.292C9.58203 10.7549 9.74902 10.5557 9.74902 10.5557Z"
          fill="#DE2429"
        />
      </svg>
    );
  }

  if (ext === "jpg" || ext === "jpeg" || ext === "png") {
    return (
      <div className="h-3 w-3 overflow-hidden rounded-sm">
        <img src={url} alt="Image" className="h-full w-full" />
      </div>
    );
  }
};

const ImageTitle = ({ title, url }) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <div
        className="cursor-pointer overflow-hidden text-ellipsis text-nowrap font-medium hover:underline"
        onClick={() => setPreviewOpen(true)}
      >
        {title}
      </div>
      {previewOpen && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
          }}
          src={url}
        />
      )}
    </>
  );
};

const PDFTitle = ({ title, url }) => {
  const handlePDFPreview = () => {
    window.open(url, "_blank");
  };

  return (
    <>
      <div
        className="cursor-pointer overflow-hidden text-ellipsis text-nowrap font-medium hover:underline"
        onClick={handlePDFPreview}
      >
        {title}
      </div>
    </>
  );
};

const FileTitle = ({ title, url }) => {
  const ext = title.split(".").pop().toLowerCase();

  if (ext === "jpg" || ext === "jpeg" || ext === "png")
    return <ImageTitle title={title} url={url} />;
  if (ext === "pdf") return <PDFTitle title={title} url={url} />;

  return (
    <div className="overflow-hidden text-ellipsis text-nowrap font-medium">
      {title}
    </div>
  );
};

const PortalFileCard = ({ title, id, url, createdAt, size, hideCheck }) => {
  const dispatch = useDispatch();
  const handleError = useError();
  const { selectedFiles, isFolderOrFileDeleting } = useSelector(
    (state) => state.portal,
  );
  const { user } = useSelector((state) => state.auth);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const permission = user.permission.portal;

  const closeDeleteModal = () => setIsDeleteModalVisible(null);

  const onFileDelete = async () => {
    try {
      await dispatch(
        deleteFolderOrFile({ id, params: { file_type: "I" } }),
      ).unwrap();
      closeDeleteModal();
      toast.success("File deleted successfully");
    } catch (error) {
      handleError(error);
    }
  };

  const onCheckboxChange = (e) => {
    const value = e.target.checked;
    value
      ? dispatch(addToSelectedFiles(title))
      : dispatch(removeToSelectedFiles(title));
  };

  return (
    <>
      <div className="rounded-lg bg-slate-100 p-2">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-0.5 overflow-hidden text-black">
            <div className="flex items-center gap-1">
              {hideCheck ? null : (
                <Checkbox
                  checked={selectedFiles.includes(title)}
                  onChange={onCheckboxChange}
                />
              )}
              <FileIcon name={title} url={url} />
            </div>
            <FileTitle title={title} url={url} />
          </div>
          <Dropdown
            menu={{
              items: [
                {
                  key: "download",
                  label: "Download",
                  icon: <Download size={14} />,
                  onClick: (e) => {
                    e.domEvent.preventDefault();
                    downloadFile(url, title);
                  },
                  hide: !permission.download,
                },
                {
                  key: "delete",
                  danger: true,
                  label: "Delete",
                  hide: !permission.delete,
                  icon: <Trash2 size={14} />,
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
        <div className="flex items-center justify-between px-2 pl-5 text-xs text-gray-500">
          <p>{dayjs(createdAt).format("DD-MM-YYYY")}</p>
          <p>{size}</p>
        </div>
      </div>
      <DeleteConfirmModal
        open={isDeleteModalVisible ? true : false}
        onCancel={closeDeleteModal}
        isDeleting={isFolderOrFileDeleting}
        onDelete={onFileDelete}
        title="Are you sure you want to delete this file?"
      />
    </>
  );
};

export default PortalFileCard;
