import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import styles from "./index.module.css";
import { useState } from "react";
import Image from 'next/image'
import profilePic from '../../../../assets/images/killua.jpg';

interface chatItemProps {
  active: boolean;
  name: string;
  phoneNumber: string | null;
  toChangeCurrentUser: (name: string, number: string | null) => void;
}

const ChatItem: React.FC<chatItemProps> = ({
  active,
  name,
  phoneNumber,
  toChangeCurrentUser,
}) => {
  const backgroundColorToggle = useColorModeValue(
    styles.lightContainer,
    styles.darkContainer
  );
  const fontColorToggle = useColorModeValue(
    styles.darkFontColor,
    styles.lightFontColor
  );
  const phoneColorToggle = useColorModeValue(
    styles.darkPhoneColor,
    styles.lightPhoneColor
  );

  const [toShowProfile, setToShowProfile] = useState(false);

  const onChangingCurrentUserHandler: React.MouseEventHandler = (
    e: React.MouseEvent
  ) => {
    //localStorage.removeItem('allMessages');
    // setTimeout(()=>{
    //   toChangeCurrentUser(name, phoneNumber)
    // },300);
     toChangeCurrentUser(name, phoneNumber);
  };

  const showProfileModal: React.MouseEventHandler = (e: React.MouseEvent) => {
    setToShowProfile(true);
  };

  const hideProfileModal: React.MouseEventHandler = (e: React.MouseEvent) => {
    setToShowProfile(false);
  };

  return (
    <React.Fragment>
      <button
        onClick={onChangingCurrentUserHandler}
        className={`${backgroundColorToggle} ${active ? styles.activeContainer : styles.container
          }`}
      >
        <div className={styles.avatar}>
          <Image src={profilePic} height={'100%'} width={'100%'}/>
        </div>
        <Box className={`${styles.chatItem_text}`}>
          <Box
            className={`${phoneNumber === null
              ? styles.chatItem_botName
              : styles.chatItem_userName
              } ${active ? styles.activeFont : fontColorToggle}`}
          >
            {name}
          </Box>
          {/* <Box
            className={`${phoneNumber === null
              ? styles.chatItem_botNumber
              : styles.chatItem_phoneNumber
              } ${active ? styles.activephoneFont : phoneColorToggle}`}
          >
            {phoneNumber}
          </Box> */}
        </Box>
      </button>
    </React.Fragment>
  );
};

export default ChatItem;
