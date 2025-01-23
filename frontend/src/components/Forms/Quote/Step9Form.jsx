import { Button, Col, Image, Input, Popconfirm, Row, Tooltip } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { CloudUpload, Download, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../axiosInstance";
import {
  addAttachment,
  removeAttachment,
  setComments,
  setFinalQuote,
} from "../../../store/features/quoteSlice";

export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const getFilePath = (attachment) => {
  return attachment.file_path
    ? `${API_URL}/public/${attachment.file_path}${attachment.name}`
    : URL.createObjectURL(attachment);
};

export const onFileDownload = (attachment) => {
  const url = getFilePath(attachment);
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.download = attachment.name;
  link.click();
};

const viewPDF = async (attachment) => {
  const url = attachment?.file_path
    ? getFilePath(attachment)
    : URL.createObjectURL(attachment);
  window.open(`${url}`, "_blank");
};

export const ImageIcon = ({ name, attachment }) => {
  const extension = name.split(".").pop().toLowerCase();
  if (extension === "docx") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded bg-[#0356C0]">
        <svg
          width="21"
          height="31"
          viewBox="0 0 31 41"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.875 35.875V5.125C3.875 4.42031 4.45625 3.84375 5.16667 3.84375H18.0833V10.25C18.0833 11.6674 19.2378 12.8125 20.6667 12.8125H27.125V35.875C27.125 36.5797 26.5437 37.1562 25.8333 37.1562H5.16667C4.45625 37.1562 3.875 36.5797 3.875 35.875ZM5.16667 0C2.31693 0 0 2.29824 0 5.125V35.875C0 38.7018 2.31693 41 5.16667 41H25.8333C28.6831 41 31 38.7018 31 35.875V12.3721C31 11.0107 30.4591 9.70547 29.4904 8.74453L22.1763 1.49746C21.2076 0.536524 19.8997 0 18.5273 0H5.16667ZM9.60677 19.3068C9.3 18.2898 8.21823 17.7133 7.19297 18.0176C6.16771 18.3219 5.58646 19.3949 5.89323 20.4119L9.76823 33.2244C10.0104 34.0412 10.7693 34.5938 11.625 34.5938C12.4807 34.5938 13.2315 34.0332 13.4818 33.2244L15.5 26.5459L17.5182 33.2244C17.7604 34.0412 18.5193 34.5938 19.375 34.5938C20.2307 34.5938 20.9815 34.0332 21.2318 33.2244L25.1068 20.4119C25.4135 19.3949 24.8323 18.3219 23.807 18.0176C22.7818 17.7133 21.7 18.2898 21.3932 19.3068L19.375 25.9854L17.3568 19.3068C17.1146 18.49 16.3557 17.9375 15.5 17.9375C14.6443 17.9375 13.8935 18.498 13.6432 19.3068L11.625 25.9854L9.60677 19.3068Z"
            fill="white"
          />
        </svg>
      </div>
    );
  }

  if (extension === "xlsx") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded bg-[#107840]">
        <svg
          width="21"
          height="31"
          viewBox="0 0 31 41"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.875 35.875V5.125C3.875 4.42031 4.45625 3.84375 5.16667 3.84375H18.0833V10.25C18.0833 11.6674 19.2378 12.8125 20.6667 12.8125H27.125V35.875C27.125 36.5797 26.5437 37.1562 25.8333 37.1562H5.16667C4.45625 37.1562 3.875 36.5797 3.875 35.875ZM5.16667 0C2.31693 0 0 2.29824 0 5.125V35.875C0 38.7018 2.31693 41 5.16667 41H25.8333C28.6831 41 31 38.7018 31 35.875V12.3721C31 11.0107 30.4591 9.70547 29.4904 8.74453L22.1763 1.49746C21.2076 0.536524 19.8997 0 18.5273 0H5.16667ZM12.5049 18.6822C11.851 17.8414 10.632 17.6973 9.78437 18.3459C8.93672 18.9945 8.79141 20.2037 9.44531 21.0445L13.0458 25.625L9.45339 30.2135C8.79948 31.0543 8.94479 32.2555 9.79245 32.9121C10.6401 33.5687 11.851 33.4166 12.513 32.5758L15.5 28.7561L18.4951 32.5678C19.149 33.4086 20.368 33.5527 21.2156 32.9041C22.0633 32.2555 22.2086 31.0463 21.5547 30.2055L17.9542 25.625L21.5466 21.0365C22.2005 20.1957 22.0552 18.9945 21.2076 18.3379C20.3599 17.6812 19.149 17.8334 18.487 18.6742L15.5 22.4939L12.5049 18.6822Z"
            fill="white"
          />
        </svg>
      </div>
    );
  }

  if (extension === "pdf") {
    return (
      <div
        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded bg-[#CA4223] transition-all hover:bg-[rgba(0,0,0,0.8)]"
        onClick={() => viewPDF(attachment)}
      >
        <svg
          width="21"
          className="hover:opacity-0"
          height="31"
          viewBox="0 0 43 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.47697 40.7812H9.5847V45H5.47697C2.45608 45 0 42.4775 0 39.375V5.625C0 2.52246 2.45608 0 5.47697 0H19.6401C21.0949 0 22.4898 0.588867 23.5168 1.64355L31.2615 9.59766C32.2885 10.6523 32.8618 12.085 32.8618 13.5791V26.7188H28.7541V14.0625H21.9079C20.3932 14.0625 19.1694 12.8057 19.1694 11.25V4.21875H5.47697C4.72389 4.21875 4.10773 4.85156 4.10773 5.625V39.375C4.10773 40.1484 4.72389 40.7812 5.47697 40.7812ZM15.0617 30.9375H17.8002C20.4445 30.9375 22.5925 33.1436 22.5925 35.8594C22.5925 38.5752 20.4445 40.7812 17.8002 40.7812H16.4309V43.5938C16.4309 44.3672 15.8148 45 15.0617 45C14.3086 45 13.6924 44.3672 13.6924 43.5938V39.375V32.3438C13.6924 31.5703 14.3086 30.9375 15.0617 30.9375ZM17.8002 37.9688C18.9383 37.9688 19.854 37.0283 19.854 35.8594C19.854 34.6904 18.9383 33.75 17.8002 33.75H16.4309V37.9688H17.8002ZM26.0156 30.9375H28.7541C31.0219 30.9375 32.8618 32.8271 32.8618 35.1562V40.7812C32.8618 43.1104 31.0219 45 28.7541 45H26.0156C25.2625 45 24.6464 44.3672 24.6464 43.5938V32.3438C24.6464 31.5703 25.2625 30.9375 26.0156 30.9375ZM28.7541 42.1875C29.5072 42.1875 30.1234 41.5547 30.1234 40.7812V35.1562C30.1234 34.3828 29.5072 33.75 28.7541 33.75H27.3849V42.1875H28.7541ZM35.6003 32.3438C35.6003 31.5703 36.2165 30.9375 36.9696 30.9375H41.0773C41.8304 30.9375 42.4465 31.5703 42.4465 32.3438C42.4465 33.1172 41.8304 33.75 41.0773 33.75H38.3388V36.5625H41.0773C41.8304 36.5625 42.4465 37.1953 42.4465 37.9688C42.4465 38.7422 41.8304 39.375 41.0773 39.375H38.3388V43.5938C38.3388 44.3672 37.7227 45 36.9696 45C36.2165 45 35.6003 44.3672 35.6003 43.5938V37.9688V32.3438Z"
            fill="white"
          />
        </svg>
        <div className="absolute inset-0 left-2 top-1 h-full w-full text-white opacity-0 hover:opacity-100">
          <svg
            width="21"
            height="31"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5C7.58 5 4.01 8.1 2.33 11.7C2.12 12.03 2 12.35 2 12.68C2 13.02 2.12 13.34 2.33 13.68C4.01 17.3 7.58 20.4 12 20.4C16.42 20.4 19.99 17.3 21.67 13.7C21.88 13.37 22 13.05 22 12.72C22 12.38 21.88 12.06 21.67 11.7C19.99 8.1 16.42 5 12 5ZM12 18C8.13 18 5 14.87 5 12C5 9.13 8.13 6 12 6C15.87 6 19 9.13 19 12C19 14.87 15.87 18 12 18ZM12 8C10.34 8 9 9.34 9 11C9 12.66 10.34 14 12 14C13.66 14 15 12.66 15 11C15 9.34 13.66 8 12 8Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    );
  }

  if (extension === "pptx") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded bg-[#CA4223]">
        <svg
          width="21"
          height="31"
          viewBox="0 0 31 41"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.16667 37.1562C4.45625 37.1562 3.875 36.5797 3.875 35.875V5.125C3.875 4.42031 4.45625 3.84375 5.16667 3.84375H18.0833V10.25C18.0833 11.6674 19.2378 12.8125 20.6667 12.8125H27.125V35.875C27.125 36.5797 26.5437 37.1562 25.8333 37.1562H5.16667ZM5.16667 0C2.31693 0 0 2.29824 0 5.125V35.875C0 38.7018 2.31693 41 5.16667 41H25.8333C28.6831 41 31 38.7018 31 35.875V12.3721C31 11.0107 30.4591 9.70547 29.4904 8.74453L22.1763 1.49746C21.2076 0.536524 19.8997 0 18.5273 0H5.16667ZM10.9792 16.6562C9.90547 16.6562 9.04167 17.5131 9.04167 18.5781V26.9062V31.3906C9.04167 32.4557 9.90547 33.3125 10.9792 33.3125C12.0529 33.3125 12.9167 32.4557 12.9167 31.3906V28.8281H16.4688C19.8594 28.8281 22.6042 26.1055 22.6042 22.7422C22.6042 19.3789 19.8594 16.6562 16.4688 16.6562H10.9792ZM16.4688 24.9844H12.9167V20.5H16.4688C17.7201 20.5 18.7292 21.501 18.7292 22.7422C18.7292 23.9834 17.7201 24.9844 16.4688 24.9844Z"
            fill="white"
          />
        </svg>
      </div>
    );
  }

  if (extension === "png" || extension === "jpg" || extension === "jpeg") {
    const imageUrl = getFilePath(attachment);
    return (
      <Image
        src={imageUrl}
        alt="attachment"
        className="!h-10 !w-10 rounded object-cover"
        loading="lazy"
      />
    );
  }
};

const AttachmentItem = ({ attachment, mode }) => {
  const dispatch = useDispatch();

  const onRemoveAttachment = () => {
    dispatch(removeAttachment(attachment.name));
  };

  return (
    <div className="flex shrink-0 items-center overflow-hidden rounded-lg border border-gray-300 p-1">
      <ImageIcon name={attachment.name} attachment={attachment} />

      <p className="mx-2 flex-1">{attachment.name}</p>
      <div className="mr-4 flex items-center gap-2">
        <Tooltip title="Download">
          <Button
            type="text"
            size="small"
            icon={<Download size={16} color="#667085" />}
            onClick={() => onFileDownload(attachment)}
          />
        </Tooltip>
        {mode !== "view" && (
          <Tooltip title="Delete">
            <Button
              type="text"
              size="small"
              icon={<Trash2 size={16} />}
              danger
              onClick={onRemoveAttachment}
            />
          </Tooltip>
        )}
      </div>
    </div>
  );
};

const Step9Form = ({ onSubmit, onBack, isFormSubmitting, mode = "create" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    attachments,
    finalQuote,
    old_files,
    oldFinalQuote,
    initialFormValues,
    comments,
  } = useSelector((state) => state.quote);
  const { user } = useSelector((state) => state.auth);
  const userType = user.user_type;

  const isCommentsDisable =
    mode === "create"
      ? false
      : mode === "view" ||
        user.user_type === "Internal" ||
        initialFormValues.status !== "Draft";

  const updateComments = (e) => {
    if (isCommentsDisable) return;
    const value = e.target.value;
    dispatch(setComments(value));
  };

  const onFinish = async (isSubmit = false) => {
    if (isSubmit && userType === "Internal" && finalQuote === null) {
      return toast.error("Please upload final quote");
    }

    try {
      // Convert attachments array to an array of Base64 strings
      const attachmentsBase64 = attachments
        ? await Promise.all(
            attachments.map((file) =>
              file.file_path ? file.name : convertFileToBase64(file),
            ),
          )
        : null;

      // Convert finalQuote to Base64 string
      const finalQuoteBase64 = finalQuote
        ? finalQuote.file_path
          ? finalQuote.name
          : await convertFileToBase64(finalQuote)
        : null;

      onSubmit({
        attachments: attachmentsBase64,
        old_files,
        final_quote: finalQuoteBase64,
        old_final_quote: oldFinalQuote,
        comments: comments,
        submitted_by: isSubmit ? user.user_id : "Internal",
      });
    } catch (error) {
      console.error("Error converting files:", error);
    }
  };

  const handleFileChange = (file) => {
    if (file) {
      dispatch(addAttachment(file.file.originFileObj));
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-lg font-medium">UPLOAD ATTACHMENTS</h2>

      <Row gutter={[16, 16]}>
        {mode !== "view" ? (
          <Col span={24} md={8}>
            <Dragger
              onChange={handleFileChange}
              action={""}
              multiple={true}
              showUploadList={false}
              customRequest={() => {}}
              accept=".pdf, .jpg, .jpg, .png, .xlsx, .docx, .pptx"
            >
              <div className="flex flex-col items-center justify-center py-8">
                <CloudUpload className="text-red-1" size={48} />
                <p className="mt-2 text-base"> Drag & Drop </p>
                <p className="text-base">
                  or <span className="text-red-1">Browse</span>
                </p>
              </div>
            </Dragger>
          </Col>
        ) : null}
        {attachments.length > 0 && (
          <Col span={24} md={16}>
            <div className="flex max-h-[200px] flex-col gap-2 overflow-y-auto">
              {attachments.map((attachment) => (
                <AttachmentItem
                  key={attachment.uid}
                  attachment={attachment}
                  mode={mode}
                />
              ))}
            </div>
          </Col>
        )}
      </Row>

      <Row gutter={[16, 16]}>
        {userType === "Internal" || finalQuote ? (
          <Col span={24} sm={8}>
            <h2 className="mb-4 mt-6 text-lg font-medium">FINAL QUOTE</h2>

            {!finalQuote && mode !== "view" && userType === "Internal" ? (
              <div className="w-36">
                <Dragger
                  onChange={(file) =>
                    file.file.type === "application/pdf" &&
                    dispatch(setFinalQuote(file.file.originFileObj))
                  }
                  action={""}
                  multiple={false}
                  showUploadList={false}
                  customRequest={() => {}}
                  accept=".pdf"
                >
                  <div className="flex flex-col items-center justify-center py-2">
                    <Plus size={18} />
                    <p className="mt-2 text-sm">Upload File</p>
                  </div>
                </Dragger>
              </div>
            ) : finalQuote ? (
              <>
                <div
                  className="relative flex h-24 w-36 cursor-pointer items-center justify-center rounded-md bg-[#CA4223] transition-all hover:bg-[rgba(0,0,0,0.8)]"
                  onClick={(e) => viewPDF(finalQuote)}
                >
                  <div className="absolute -top-2 right-2 flex items-center justify-center gap-2">
                    <Tooltip title="Download">
                      <div
                        className="cursor-pointer rounded-sm border border-gray-300 bg-white p-1 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFileDownload(finalQuote);
                        }}
                      >
                        <Download size={14} />
                      </div>
                    </Tooltip>
                    {mode !== "view" && userType === "Internal" && (
                      <Tooltip title="Delete">
                        <div
                          className="cursor-pointer rounded-sm border border-gray-300 bg-white p-1 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setFinalQuote(null));
                          }}
                        >
                          <Trash2 size={14} color="#FF0000" />
                        </div>
                      </Tooltip>
                    )}
                  </div>
                  <svg
                    width="33"
                    height="35"
                    viewBox="0 0 43 45"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.47697 40.7812H9.5847V45H5.47697C2.45608 45 0 42.4775 0 39.375V5.625C0 2.52246 2.45608 0 5.47697 0H19.6401C21.0949 0 22.4898 0.588867 23.5168 1.64355L31.2615 9.59766C32.2885 10.6523 32.8618 12.085 32.8618 13.5791V26.7188H28.7541V14.0625H21.9079C20.3932 14.0625 19.1694 12.8057 19.1694 11.25V4.21875H5.47697C4.72389 4.21875 4.10773 4.85156 4.10773 5.625V39.375C4.10773 40.1484 4.72389 40.7812 5.47697 40.7812ZM15.0617 30.9375H17.8002C20.4445 30.9375 22.5925 33.1436 22.5925 35.8594C22.5925 38.5752 20.4445 40.7812 17.8002 40.7812H16.4309V43.5938C16.4309 44.3672 15.8148 45 15.0617 45C14.3086 45 13.6924 44.3672 13.6924 43.5938V39.375V32.3438C13.6924 31.5703 14.3086 30.9375 15.0617 30.9375ZM17.8002 37.9688C18.9383 37.9688 19.854 37.0283 19.854 35.8594C19.854 34.6904 18.9383 33.75 17.8002 33.75H16.4309V37.9688H17.8002ZM26.0156 30.9375H28.7541C31.0219 30.9375 32.8618 32.8271 32.8618 35.1562V40.7812C32.8618 43.1104 31.0219 45 28.7541 45H26.0156C25.2625 45 24.6464 44.3672 24.6464 43.5938V32.3438C24.6464 31.5703 25.2625 30.9375 26.0156 30.9375ZM28.7541 42.1875C29.5072 42.1875 30.1234 41.5547 30.1234 40.7812V35.1562C30.1234 34.3828 29.5072 33.75 28.7541 33.75H27.3849V42.1875H28.7541ZM35.6003 32.3438C35.6003 31.5703 36.2165 30.9375 36.9696 30.9375H41.0773C41.8304 30.9375 42.4465 31.5703 42.4465 32.3438C42.4465 33.1172 41.8304 33.75 41.0773 33.75H38.3388V36.5625H41.0773C41.8304 36.5625 42.4465 37.1953 42.4465 37.9688C42.4465 38.7422 41.8304 39.375 41.0773 39.375H38.3388V43.5938C38.3388 44.3672 37.7227 45 36.9696 45C36.2165 45 35.6003 44.3672 35.6003 43.5938V37.9688V32.3438Z"
                      fill="white"
                    />
                  </svg>
                  <div className="absolute inset-0 left-12 top-7 h-full w-full text-white opacity-0 hover:opacity-100">
                    <svg
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 5C7.58 5 4.01 8.1 2.33 11.7C2.12 12.03 2 12.35 2 12.68C2 13.02 2.12 13.34 2.33 13.68C4.01 17.3 7.58 20.4 12 20.4C16.42 20.4 19.99 17.3 21.67 13.7C21.88 13.37 22 13.05 22 12.72C22 12.38 21.88 12.06 21.67 11.7C19.99 8.1 16.42 5 12 5ZM12 18C8.13 18 5 14.87 5 12C5 9.13 8.13 6 12 6C15.87 6 19 9.13 19 12C19 14.87 15.87 18 12 18ZM12 8C10.34 8 9 9.34 9 11C9 12.66 10.34 14 12 14C13.66 14 15 12.66 15 11C15 9.34 13.66 8 12 8Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
                <p className="mt-2">{finalQuote.name}</p>
              </>
            ) : null}
          </Col>
        ) : null}

        <Col span={24} sm={16}>
          <h2 className="mb-4 mt-6 text-lg font-medium">Comment</h2>
          <Input.TextArea
            placeholder={isCommentsDisable ? null : "Type comment here..."}
            disabled={isCommentsDisable}
            rows={4}
            value={comments}
            onChange={updateComments}
          />
        </Col>
      </Row>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {mode === "view" ? (
          <Button type="default" onClick={() => navigate("/quote")}>
            Cancel
          </Button>
        ) : (
          <Popconfirm
            title="Are you sure?"
            description="Are you sure to cancel, all changes will be lost?"
            cancelText="No"
            okText="Yes"
            onConfirm={() => navigate("/quote")}
          >
            <Button type="default">Cancel</Button>
          </Popconfirm>
        )}
        <Button type="text" className="!bg-gray-1 text-white" onClick={onBack}>
          Back
        </Button>
        {mode !== "view" && (
          <>
            <Button
              type="primary"
              loading={isFormSubmitting === true}
              onClick={() => onFinish()}
            >
              Save {userType === "Partner" ? "as Draft" : null}
            </Button>
            {userType === "Partner" ? (
              <Popconfirm
                title="Are you sure?"
                description="Are you sure to submit the quote request?"
                onConfirm={() => onFinish(true)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  loading={isFormSubmitting === "submitting"}
                >
                  Submit
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="Are you sure?"
                description="Are you sure to complete the quote request?"
                onConfirm={() => onFinish(true)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  loading={isFormSubmitting === "submitting"}
                  disabled={finalQuote === null}
                >
                  Complete
                </Button>
              </Popconfirm>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Step9Form;
