import { Avatar, Button } from "antd";
import { Download, User2, Volume2 } from "lucide-react";
import { API_URL } from "../../axiosInstance";
import { ImageIcon } from "../Forms/Quote/Step9Form";

async function downloadFile(attachment) {
  const url = `${API_URL}/public/${attachment.file_path}${attachment.name}`;
  fetch(url)
    .then((resp) => resp.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = attachment.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(() => alert("An error sorry"));
}

const Attachment = ({ attachment }) => {
  return (
    <div className="my-2 flex items-center justify-between gap-2 rounded p-2 hover:bg-gray-100">
      <div className="flex items-center gap-2">
        <ImageIcon name={attachment.name} attachment={attachment} />
        <p>{attachment.name}</p>
      </div>

      <Button
        type="text"
        icon={<Download size={18} />}
        size="small"
        onClick={() => downloadFile(attachment)}
      />
    </div>
  );
};

const speakMessage = (message) => {
  const synth = window.speechSynthesis;
  if (synth.speaking) {
    synth.cancel();
  }
  const msg = new SpeechSynthesisUtterance(message);
  msg.pitch = 2.5;
  msg.rate = 1.5;
  synth.speak(msg);
};

const ChatMessage = ({
  isOwn,
  message = "",
  image,
  name,
  type,
  time,
  attachment,
}) => {
  return (
    <div
      className={`my-2 flex items-start gap-2.5 ${isOwn ? "justify-end" : ""}`}
    >
      {!isOwn && (
        <Avatar
          src={type === "Partner" ? image : null}
          icon={<User2 />}
          size={32}
        />
      )}
      <div
        className={`leading-1.5 flex w-full max-w-[320px] flex-col rounded-xl border-gray-200 p-4 ${
          isOwn
            ? "rounded-bl-xl rounded-br-xl bg-blue-100"
            : "rounded-e-xl rounded-es-xl bg-white"
        }`}
      >
        <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900">
            {isOwn ? "You" : type === "Partner" ? name : ""}
            <span className="text-red-1 text-xs">
              {isOwn ? "" : type === "Partner" ? ` - ${type}` : type}
            </span>
          </span>
          {message ? (
            <Button
              onClick={() => speakMessage(message)}
              icon={<Volume2 size={12} />}
              shape="circle"
              size="small"
            />
          ) : null}
        </div>
        {attachment ? <Attachment attachment={attachment} /> : null}
        <p className="py-2.5 text-sm font-normal text-gray-900">{message}</p>
        <p className="self-end text-xs text-gray-500">{time}</p>
      </div>
      {isOwn && <Avatar src={image} icon={<User2 />} size={32} />}
    </div>
  );
};

export default ChatMessage;
