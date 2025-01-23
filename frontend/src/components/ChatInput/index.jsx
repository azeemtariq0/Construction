import { Button, Input, Space } from "antd";
import { Mic, Paperclip, SendHorizontal, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useError from "../../hooks/useError";
import {
  addMessage,
  getMessages,
  sendMessage,
} from "../../store/features/chatSlice";
import { convertFileToBase64, ImageIcon } from "../Forms/Quote/Step9Form";

const ChatInput = ({ scrollLast }) => {
  const [attachment, setAttachment] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { isSending } = useSelector((state) => state.chat);

  const { id } = useParams();
  const dispatch = useDispatch();
  const handleError = useError();

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (SpeechRecognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log(transcript);
      setMessageText(`${messageText} ${transcript}`);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Invalid file type. Please select a PDF, JPEG, PNG, XLSX, DOCX, or PPTX file.",
          {
            duration: 8000,
          },
        );
        event.target.value = "";
        return;
      }

      setAttachment(file);
    }

    event.target.value = "";
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const startListening = () => {
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognition.stop();
    setIsListening(false);
  };

  const onSendMessage = async () => {
    try {
      if (!messageText.trim() && !attachment) return;

      const message = {
        name: user.name,
        message: messageText,
        time: "Just Now",
        image: user.image_url,
        type: user.user_type,
        id: Date.now(),
        user_id: user.user_id,
      };

      if (attachment) {
        const base64Attachment = await convertFileToBase64(attachment);
        message.attachment_name = attachment.name;
        message.attachment = base64Attachment;
      } else {
        await dispatch(addMessage(message));
        setMessageText("");
        scrollLast();
      }

      await dispatch(
        sendMessage({
          request_id: id,
          user_id: user.user_id,
          message: message.message,
          attachment: message.attachment,
          attachment_name: message.attachment_name,
        }),
      ).unwrap();

      setMessageText("");
      setAttachment(null);
      await dispatch(getMessages({ request_id: id }));
      scrollLast();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Space.Compact className="relative w-full">
      {attachment ? (
        <div className="absolute bottom-10 flex w-full flex-wrap gap-1 rounded-t-lg bg-[#7e7e7e6b] p-1">
          <div className="relative w-full">
            <div
              className="absolute -top-0 right-0 z-50 cursor-pointer bg-red-500 p-[2px]"
              onClick={removeAttachment}
            >
              <X size={14} color="white" />
            </div>
            <div className="flex items-center gap-2">
              <ImageIcon name={attachment.name} attachment={attachment} />
              <span className="text-sm">{attachment.name}</span>
            </div>
          </div>
        </div>
      ) : null}

      <Input
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        addonBefore={
          <>
            <Paperclip
              size={20}
              className="cursor-pointer text-[#3C3D37]"
              onClick={() => fileInputRef.current.click()}
            />
          </>
        }
        suffix={
          <Mic
            size={20}
            className={`ml-2 cursor-pointer ${
              isListening
                ? "text-red-500"
                : !SpeechRecognition
                  ? "text-gray-400"
                  : "text-gray-500"
            }`}
            onClick={
              SpeechRecognition
                ? isListening
                  ? stopListening
                  : startListening
                : null
            }
            style={!SpeechRecognition ? { cursor: "not-allowed" } : {}}
          />
        }
        size="large"
        placeholder="Type a message or speak..."
        onPressEnter={onSendMessage}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx,.pptx"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <Button
        type="primary"
        size="large"
        onClick={onSendMessage}
        loading={isSending}
      >
        <SendHorizontal size={24} />
      </Button>
    </Space.Compact>
  );
};

export default ChatInput;
