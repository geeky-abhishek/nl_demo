import React, { useEffect } from "react";
import { Box, Flex, Button } from "@chakra-ui/react";
import styles from "./index.module.css";
import { useColorModeValue, IconButton } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faShower } from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";
import Image from "next/image";
import profilePic from "../../../assets/images/killua.jpg";

const ChatUiWindow = dynamic(() => import("./ChatUiWindow"), {
  ssr: false,
});

interface chatWindowProps {
  currentMessageObj: {
    user: string;
    phoneNumber: string | null;
    messages: any[];
  };
  toClearChat: () => void;
  messages: any[];
  username: string;
  selected: (option: { key: string; text: string; backmenu: boolean }) => void;
  toSendMessage: (text: string, media: any) => void;
  currentUser: { name: string; number: string | null };
  sendLocation: (location: string) => void;
  toShowChats: (event: React.MouseEvent) => void;
}


const ChatWindow: React.FC<chatWindowProps> = ({
  toClearChat,
  currentMessageObj,
  messages,
  username,
  selected,
  toSendMessage,
  currentUser,
  sendLocation,
  toShowChats,
  socket,
  setState
}) => {
  const textColor = useColorModeValue("black", "white");
  const backgroundColorToggle = useColorModeValue(
    styles.lightContainer,
    styles.darkContainer
  );
  const backBoxToggle = useColorModeValue(
    styles.lightBackBox,
    styles.darkBackBox
  );
  const headingColorToggle = useColorModeValue(
    styles.lightUsername,
    styles.darkUsername
  );
  console.log("vvv:", { currentUser });

  
  return (
    <Flex
      bgColor="var(--primarydarkblue)"
      flexDirection="column"
      height="100vh"
      width="100%"
    >
      {/* Top Section */}
      <Box className={`${styles.top_section} ${backgroundColorToggle}`}>
        {/* For the back button */}
        <Box flex="1.5" className={headingColorToggle}>
          <Button
            style={{
              border: "none",
              padding: "1rem",
              borderRadius: "1.5rem",
            }}
            onClick={toShowChats}
            size="lg"
            variant="ghost"
            fontSize="lg"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
        </Box>
        {/* Name and Icon */}
        <Flex flex="9" justifyContent="space-between" alignItems="center">
          <Flex justifyContent="center" alignItems="center">
            <Box className={`${styles.avatarContainer} ${headingColorToggle} `}>
              {
                <>
                  <div className={styles.innerRing}>
                    <Image src={profilePic} height={"100%"} width={"100%"} />
                  </div>
                  <Box>{currentUser.name}</Box>
                </>
              }
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/* Chat Window */}
      <Box className={`${styles.chatWindow} ${backgroundColorToggle}`}>
        {/* NeoMorphism Box */}
        <Box className={`${styles.BackBox} ${backBoxToggle}`}>
          {/* Chat Area */}
          <Box style={{ height: "100%" }}>
            <ChatUiWindow
              currentMessageObj={currentMessageObj}
              messagesog={messages}
              username={username}
              selected={selected}
              onSend={toSendMessage}
              currentUser={currentUser}
              setState={setState}
              socket={socket}
            />
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default ChatWindow;
