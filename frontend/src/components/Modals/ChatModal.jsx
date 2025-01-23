import { FloatButton, Modal } from "antd";
import { MessageSquare, MessageSquareX } from "lucide-react";
import { useEffect, useRef } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useError from "../../hooks/useError";
import { getMessages } from "../../store/features/chatSlice";
import ChatInput from "../ChatInput";
import ChatMessage from "../ChatMessage";

const ChatModal = ({ quoteNo }) => {
  const { id } = useParams();
  const chatRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleError = useError();
  const { user } = useSelector((state) => state.auth);
  const { messages, isLoading, isUnreadMessage } = useSelector(
    (state) => state.chat,
  );

  const isModalOpen = location.hash === "#chat";

  const showModal = () => {
    navigate(`${location.pathname}${location.search}#chat`);
  };
  const closeModal = () => {
    navigate(`${location.pathname}${location.search}`);
  };

  const scrollLast = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  if (isUnreadMessage) {
    scrollLast();
  }

  useEffect(() => {
    let intervalId;
    const fetchMessages = (isInitial = false) => {
      dispatch(getMessages({ request_id: id, user_id: user.user_id }))
        .unwrap()
        .then(() => isInitial && scrollLast())
        .catch(handleError);
    };

    if (isModalOpen) {
      fetchMessages(true); // Fetch messages initially when modal is opened
      intervalId = setInterval(fetchMessages, 5000); // Set interval to fetch messages every 5 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Clear interval when modal is closed or component unmounts
      }
    };
  }, [isModalOpen, id]);

  return (
    <div>
      <Modal
        title={`Comment Box - ${quoteNo}`}
        centered
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        styles={{
          content: {
            padding: "10px 10px",
          },
        }}
      >
        <div className="rounded-lg bg-gray-100 p-2">
          <div className="max-h-[450px] overflow-y-auto" ref={chatRef}>
            {isLoading && messages === null ? (
              <div className="flex h-56 w-full items-center justify-center">
                <ThreeDots color="#ce0105" />
              </div>
            ) : null}

            {messages && messages.length === 0 ? (
              <div className="flex h-56 w-full items-center justify-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <MessageSquareX size={32} />
                  <p className="text-lg font-semibold">No messages found</p>
                </div>
              </div>
            ) : null}

            {messages
              ? messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    {...message}
                    isOwn={message.user_id === user.user_id}
                  />
                ))
              : null}
          </div>

          <ChatInput scrollLast={scrollLast} />
        </div>
      </Modal>

      <FloatButton
        type="primary"
        onClick={showModal}
        description={
          <div className="flex items-center gap-2">
            <MessageSquare size={18} />
            <span>Follow Up</span>
          </div>
        }
        className="w-28 rounded-lg"
        shape="square"
      />
    </div>
  );
};

export default ChatModal;
