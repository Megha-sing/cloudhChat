import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeleton/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Scroll to latest message
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  // Emoji-only detection
  const isEmojiOnly = (text) =>
    /^(?:\p{Emoji}|\p{Extended_Pictographic}|\s)+$/u.test(text);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isSender = message.senderId === authUser._id;

          return (
            <div
              key={message._id || index}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              {message.image && !message.text ? (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md"
                />
              ) : (
                <>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && (
                    <div
                      className={
                        isEmojiOnly(message.text)
                          ? "text-3xl"
                          : `chat-bubble ${
                              isSender
                                ? "bg-secondary text-secondary-content"
                                : "bg-base-300 text-base-content"
                            }`
                      }
                    >
                      {message.text}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
