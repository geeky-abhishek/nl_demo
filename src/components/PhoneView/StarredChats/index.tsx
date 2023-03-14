import React from "react";
import styles from "./index.module.css";
import { Box, Flex, useColorModeValue, Button } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

interface recentChatsProps {
  allUsers: { name: string; number: string | null; active: boolean }[];
  toChangeCurrentUser: (name: string, number: string | null) => void;
  tohideStarredSection: () => void;
  chats:Array<any>;
  setStarredChats:(arg:Array<any>)=>any,
}

const StarredChats: React.FC<recentChatsProps> = ({
  allUsers,
  toChangeCurrentUser,
  chats,setStarredChats,
  tohideStarredSection
}) => {
  const backgroundColorToggle = useColorModeValue(
    styles.lightContainer,
    styles.darkContainer
  );

  const backBoxToggle = useColorModeValue(
    styles.lightBackBox,
    styles.darkBackBox
  );

  const onchangingCurrentUserHandler = (
    name: string,
    number: string | null
  ) => {
    toChangeCurrentUser(name, number);
  };

  return (
    <Flex
      flexDirection="column"
      height="100vh"
      className={backgroundColorToggle}
    >
      <Box className={`${styles.top_section} ${backgroundColorToggle}`}>
        {/* For the back button */}
        <Box flex="1.5">
          <Button
            style={{
              border: "none",
              padding: "1rem",
              borderRadius: "1.5rem",
            }}
            onClick={tohideStarredSection}
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
            <Box className={`${styles.avatarContainer}`}>
              {
                  <Box>Starred Messages</Box>
              }
            </Box>
          </Flex>
        </Flex>
      </Box>

      <Box className={styles.mainContainer}>
        <Box className={`${styles.backBox} ${backBoxToggle}`}>
          <Box className={styles.chatList}>
            {/* {allUsers.map((user, index) => {
              return (
                <ChatItem
                  toRemoveUser={toRemoveUser}
                  toChangeCurrentUser={onchangingCurrentUserHandler}
                  key={index}
                  active={user.active}
                  name={user.name}
                  phoneNumber={user.number}
                />
              );
            })} */}
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default StarredChats;
