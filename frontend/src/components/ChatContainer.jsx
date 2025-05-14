import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";


import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {messages, getMessages, isMessagesLoading, selectedUser } = useChatStore();
  const { authUser, socket } = useAuthStore();
  
  // Référence pour l'élément conteneur de messages
  const messagesEndRef = useRef(null);
  
  // Fonction pour faire défiler vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Charger les messages quand l'utilisateur sélectionné change
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);
  
  // Configuration des écouteurs socket pour les nouveaux messages
  useEffect(() => {
    if (socket && selectedUser) {
      // Fonction de gestion des nouveaux messages
      const handleNewMessage = (newMessage) => {
        // Vérifier si le message concerne la conversation actuelle
        if (
          (newMessage.senderId === selectedUser._id && newMessage.receiverId === authUser._id) ||
          (newMessage.senderId === authUser._id && newMessage.receiverId === selectedUser._id)
        ) {
          // Ajouter le nouveau message à la liste
          useChatStore.getState().addMessage(newMessage);
        }
      };

      // S'abonner à l'événement de réception de message
      socket.on("getMessage", handleNewMessage);

      // Nettoyage lors du démontage du composant
      return () => {
        socket.off("getMessage", handleNewMessage);
      };
    }
  }, [socket, selectedUser, authUser]);

  // Défiler vers le bas quand les messages changent
  useEffect(() => {
    scrollToBottom();
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

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        {/* Élément de référence pour le défilement automatique */}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;