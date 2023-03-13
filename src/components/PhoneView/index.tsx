import React from "react";
import ChatWindow from "./ChatWindow";
import { useState } from "react";
import RecentChats from "./RecentChats";
import StarredChats from "./StarredChats";
import NoSSR from "react-no-ssr";
const Loading = () => <div>Loading...</div>;
import dynamic from "next/dynamic";

const DynamicSidebarWithNoSSR = dynamic(
  () => import("./ChatWindow/ChatUiWindow"),
  {
    ssr: false,
  }
);
interface phoneViewProps {
  currentMessageObj: {
    user: string;
    phoneNumber: string | null;
    messages: any[];
  };
  toClearChat: () => void;
  messages: any[];
  // recieved: boolean;
  username: string;
  selected: (option: { key: string; text: string; backmenu: boolean }) => void;
  sendMessageFunc: (text: string, media: any) => void;
  allUsers: { name: string; number: string | null; active: boolean }[];
  toChangeCurrentUser: (name: string, number: string | null) => void;
  currentUser: { name: string; number: string | null };
  toShowChats: { name: string; number: string | null };
  onSendLocation: (location: string) => void;
}

const PhoneView: React.FC<phoneViewProps> = ({
  toClearChat,
  currentMessageObj,
  messages,
  username,
  selected,
  sendMessageFunc,
  allUsers,
  toChangeCurrentUser,
  currentUser,
  toShowChats,
  onSendLocation,
  setState
}) => {
  const [toggleView, setToggleView] = useState(true);
  const [starredView, setStarredView] = useState(false);

  const showChatSection: React.MouseEventHandler = (
    event: React.MouseEvent
  ) => {
    setToggleView(true);
  };

  const showChatWindow = () => {
    setToggleView(false);
  };

  const hideStarredSection = () => {
    setStarredView(false);
  };

  const showStarredSection = () => {
    setStarredView(true);
  };

  if(!starredView){
    if (!toggleView) {
      return (
        <ChatWindow
          toClearChat={toClearChat}
          currentMessageObj={currentMessageObj}
          currentUser={currentUser}
          toShowChats={showChatSection}
          messages={messages}
          username={username}
          selected={selected}
          setState={setState}
          toSendMessage={sendMessageFunc}
          sendLocation={onSendLocation}
        />
      );
    } else {
      return (
        <RecentChats
          toChangeCurrentUser={toChangeCurrentUser}
          allUsers={allUsers}
          toShowChatWindow={showChatWindow}
          toShowStarredView={showStarredSection}
        />
      );
    }
  }else{
    return (
      <StarredChats
        toChangeCurrentUser={toChangeCurrentUser}
        allUsers={allUsers}
        tohideStarredSection={hideStarredSection}
      />
    );
  }
};

export default PhoneView;
