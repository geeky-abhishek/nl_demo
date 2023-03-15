import React from "react";
import styles from "./index.module.css";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import ChatItem from "./ChatItem";

interface recentChatsProps {
  allUsers: { name: string; number: string | null; active: boolean }[];
  // toChangeCurrentUser: (name: string, number: string | null) => void;
  toChangeCurrentUser: (arg: { name: string; number: string | null }) => void;
  toShowChatWindow: () => void;
  toShowStarredView: () => void;
}

const RecentChats: React.FC<recentChatsProps> = ({
  allUsers,
  toChangeCurrentUser,
  toShowChatWindow,
  toShowStarredView,
}) => {
  const backgroundColorToggle = useColorModeValue(
    styles.lightContainer,
    styles.darkContainer
  );
  const fontColorToggle = useColorModeValue(
    styles.lightColor,
    styles.darkColor
  );

  const backBoxToggle = useColorModeValue(
    styles.lightBackBox,
    styles.darkBackBox
  );

  const onchangingCurrentUserHandler = (
    name: string,
    number: string | null
  ) => {
    toChangeCurrentUser({ name, number });
    toShowChatWindow();
  };

  const StarredViewHandler = () => {
    toShowStarredView();
  };

  console.log("hjk:", { allUsers });
  return (
    <Flex
      flexDirection="column"
      height="100vh"
      className={backgroundColorToggle}
    >
      {/* Top Section */}
      <Box className={`${styles.headerContainer}  ${fontColorToggle}`}>
        <Box className={styles.heading}>Chats</Box>
        <Box className={styles.logo_box}></Box>
      </Box>

      <Box className={styles.mainContainer}>
        {/* Chat Section */}

        <Box className={`${styles.backBox} ${backBoxToggle}`}>
          <button className={`${styles.starred}`} onClick={StarredViewHandler}>
            Starred Messages
          </button>
          <Box className={styles.chatList}>
            {allUsers.length > 0 ? (
              <>
                {(allUsers ?? [])?.map((user, index) => {
                  return (
                    <ChatItem
                      toChangeCurrentUser={onchangingCurrentUserHandler}
                      key={index}
                      active={user.active}
                      name={user.name}
                      phoneNumber={user.number}
                      user={user}
                    />
                  );
                })}
              </>
            ) : (
              <ChatItem
                toChangeCurrentUser={() => null}
                key={0}
                active={false}
                name={"No Bots Available"}
                phoneNumber={""}
                user={{}}
                isBlank
              />
            )}

            
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default RecentChats;
