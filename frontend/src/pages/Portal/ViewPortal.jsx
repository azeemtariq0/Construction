import { Breadcrumb, Button, Col, Dropdown, Input, Row } from "antd";
import Title from "antd/es/typography/Title";
import {
  ChevronRight,
  ChevronsRight,
  Download,
  FileInput,
  FolderPlus,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { API_URL } from "../../axiosInstance";
import PortalFileCard from "../../components/Cards/PortalFileCard";
import PortalFolderCard from "../../components/Cards/PortalFolderCard";
import { convertFileToBase64 } from "../../components/Forms/Quote/Step9Form";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import useDebounce from "../../hooks/useDebounce";
import useError from "../../hooks/useError";
import {
  createFolderOrFile,
  deletePortalFiles,
  downloadPortalFiles,
  getFolderData,
  setFolderSearch,
} from "../../store/features/portalSlice";

const ViewPortal = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const handleError = useError();
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(null);
  const {
    selectedFiles,
    folders,
    files,
    breadcrumbs,
    isFolderGetting,
    isDownloading,
    isDeleting,
    isFolderOrFileCreating,
    folderSearch,
  } = useSelector((state) => state.portal);
  const { user } = useSelector((state) => state.auth);
  const debounceSearch = useDebounce(folderSearch, 500);

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const folder = searchParams.get("folder");

  const permission = user.permission.portal;

  const closeDeleteModal = () => setDeleteModalIsOpen(null);

  const onFilesDelete = async () => {
    const files = selectedFiles.map((file) => ({
      portal_id: id,
      folder_id: folder,
      file,
    }));

    try {
      await dispatch(
        deletePortalFiles({
          bulk_files: files,
        }),
      ).unwrap();
      closeDeleteModal();
      toast.success("Files deleted successfully");
    } catch (error) {
      handleError(error);
    }
  };

  const onDownloadFiles = async () => {
    const files = selectedFiles.map((file) => ({
      portal_id: id,
      folder_id: folder,
      file,
    }));

    try {
      await dispatch(
        downloadPortalFiles({
          bulk_files: files,
        }),
      ).unwrap();
      toast.success("Files downloaded successfully");
    } catch (error) {
      handleError(error);
    }
  };

  const generateFolderName = () => {
    let baseName = "New Folder";
    let newName = baseName;
    let counter = 1;

    // Check for conflicts and generate a unique name
    while (folders.find((folder) => folder.folder_name === newName)) {
      counter++;
      newName = `${baseName} (${counter})`;
    }

    return newName;
  };

  const generateFileName = (name) => {
    let baseName = name;
    let newName = baseName;
    let counter = 1;

    const [fileName, ext] = name.split(".");
    while (files.find((folder) => folder.file_name === newName)) {
      counter++;
      newName = `${fileName} (${counter}).${ext}`;
    }

    return newName;
  };

  const onFolderCreate = async () => {
    try {
      await dispatch(
        createFolderOrFile({
          portal_id: id,
          user_id: user.user_id,
          folder_name: generateFolderName(),
          parent_id: folder || null,
          file_type: "F",
        }),
      ).unwrap();
      toast.success("Folder created successfully");
    } catch (error) {
      handleError(error);
    }
  };

  const onFileUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) return;

    // Reset the file input
    fileInputRef.current.value = null;

    // List of allowed file extensions
    const allowedExtensions = [
      ".pdf",
      ".docx",
      ".xlsx",
      ".jpg",
      ".png",
      ".jpeg",
    ];

    // Get file extension
    const fileExtension = file.name.split(".").pop().toLowerCase();

    // Check if file extension is allowed
    if (!allowedExtensions.includes(`.${fileExtension}`)) {
      toast.error(
        "Unsupported file format. Please upload a file with one of the following formats: .pdf, .docx, .xlsx, .jpg, .png, .jpeg",
      );
      return;
    }

    try {
      const base64File = await convertFileToBase64(file);
      await dispatch(
        createFolderOrFile({
          portal_id: id,
          user_id: user.user_id,
          file_name: generateFileName(file.name),
          parent_id: folder || null,
          file_type: "I",
          file: base64File,
        }),
      ).unwrap();
      toast.success("File uploaded successfully");
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    dispatch(
      getFolderData({
        id,
        params: {
          parent_id: folder || null,
          search: folderSearch.trim(),
        },
      }),
    ).unwrap();
  }, [folder, debounceSearch]);

  const folderBreadcrumb = breadcrumbs.map((item, index, array) => {
    // Check if the current item is the last item in the breadcrumb
    const isLastItem = index === array.length - 1;

    return {
      title: isLastItem ? (
        // If it's the last item, render plain text
        item.name
      ) : (
        // Otherwise, render a clickable link
        <Link
          to={item.url ? `/portal/${id}?folder=${item.url}` : `/portal/${id}`}
          className="!text-black hover:underline"
        >
          {item.name}
        </Link>
      ),
    };
  });

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <Title level={4}>PORTALS</Title>
        <Breadcrumb
          items={[
            {
              title: "Portals",
            },
            {
              title: "Sales",
            },
          ]}
          separator={<ChevronsRight size={20} className="mt-0.5" />}
        />
      </div>

      <div className="min-h-96 rounded-lg bg-white p-2 sm:p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <Breadcrumb
            items={[
              {
                title: (
                  <Link to="/portal">
                    <div className="text-black hover:underline">Portals</div>
                  </Link>
                ),
              },
              ...folderBreadcrumb,
            ]}
            separator={<ChevronRight size={16} className="mt-1" />}
          />

          <div className="ml-auto flex w-full items-center justify-end gap-2 sm:w-fit">
            <div className="flex items-center gap-2">
              {permission.download ? (
                <Button
                  type="primary"
                  icon={<Download size={22} />}
                  className="bg-green-700 hover:!bg-green-600 disabled:hover:!bg-gray-100"
                  disabled={selectedFiles.length === 0}
                  onClick={onDownloadFiles}
                  loading={isDownloading}
                />
              ) : null}
              {permission.delete ? (
                <Button
                  type="primary"
                  icon={<Trash2 size={22} />}
                  danger
                  disabled={selectedFiles.length === 0}
                  onClick={() => setDeleteModalIsOpen(true)}
                />
              ) : null}
            </div>
            <Input
              placeholder="search"
              value={folderSearch}
              onChange={(e) => dispatch(setFolderSearch(e.target.value))}
            />
            {permission.add ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "new-folder",
                      label: "New Folder",
                      icon: <FolderPlus size={14} />,
                      onClick: onFolderCreate,
                    },
                    {
                      key: "file-upload",
                      label: "File Upload",
                      icon: <FileInput size={14} />,
                      onClick: () => fileInputRef.current.click(),
                    },
                  ],
                }}
                trigger={["click"]}
              >
                <Button
                  icon={<Plus size={16} />}
                  loading={isFolderOrFileCreating}
                >
                  New
                </Button>
              </Dropdown>
            ) : null}
          </div>
        </div>

        <h4 className="text-lg font-medium">Folders</h4>
        {isFolderGetting ? (
          <div className="flex min-h-20 w-full items-center justify-center">
            <ThreeDots color="#ce0105" />
          </div>
        ) : null}

        {folders.length > 0 ? (
          <Row gutter={[16, 16]} className="mb-4 mt-2">
            {folders.map((folder) => (
              <Col span={12} md={8} lg={6} key={folder.id}>
                <PortalFolderCard
                  title={folder.folder_name}
                  id={folder.id}
                  hasSubFolders={folder.sub_folder > 0}
                  isNew={folder?.isNew}
                />
              </Col>
            ))}
          </Row>
        ) : null}

        {folders.length === 0 && !isFolderGetting ? (
          <div className="flex min-h-20 w-full items-center justify-center">
            <h4 className="text-lg font-medium text-gray-400">
              No Folders Found
            </h4>
          </div>
        ) : null}

        <h4 className="text-lg font-medium">Files</h4>
        {isFolderGetting ? (
          <div className="flex min-h-20 w-full items-center justify-center">
            <ThreeDots color="#ce0105" />
          </div>
        ) : null}

        <Row gutter={[16, 16]} className="mt-2">
          {files.map((file) => (
            <Col span={12} md={8} lg={6} key={file.id}>
              <PortalFileCard
                title={file.file_name}
                url={`${API_URL}/${file.file_path}${file.file_name}`}
                id={file.id}
                createdAt={file.created_at}
                size={file.file_size}
                hideCheck={!!folderSearch.trim()}
              />
            </Col>
          ))}
        </Row>

        {files.length === 0 && !isFolderGetting ? (
          <div className="flex min-h-20 w-full items-center justify-center">
            <h4 className="text-lg font-medium text-gray-400">
              No Files Found
            </h4>
          </div>
        ) : null}
      </div>

      <DeleteConfirmModal
        open={deleteModalIsOpen ? true : false}
        onCancel={closeDeleteModal}
        onDelete={onFilesDelete}
        isDeleting={isDeleting}
        title="Are you sure you want to delete these files?"
        description="After deleting, you will not be able to recover it."
      />

      <input
        ref={fileInputRef}
        accept=".pdf,.docx,.xlsx,.jpg,.png,.jpeg"
        type="file"
        className="hidden"
        onChange={onFileUpload}
      />
    </>
  );
};

export default ViewPortal;
