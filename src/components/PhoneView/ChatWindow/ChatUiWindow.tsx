// import '@chatui/core/es/styles/index.less';
import { position } from "@chakra-ui/react";
import Chat, {
  Bubble,
  useMessages,
  Card,
  CardMedia,
  CardTitle,
  CardText,
  CardActions,
  Button,
  ScrollView,
} from "@chatui/core";
import "@chatui/core/dist/index.css";
import axios from "axios";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

const normalizedChat = (chats: any) => {
  return chats.map(chat=>({
    text:chat?.payload?.text,
    username:chat?.userId,
    position:chats?.messageState==='REPLIED' ? 'left' : 'right'
    //choices:
  }))
};

interface messageProps {
  text: any;
  username: string;
  self: boolean;
  choices: { key: string; text: string; backmenu: boolean }[];
  data: any;
  location: any;
  image: any;
  caption: string;
  audio: any;
  video: any;
  doc: any;
}
const ChatUiWindow: FC<{
  currentMessageObj: {
    user: string;
    phoneNumber: string | null;
    messages: any[];
  };
  data?: any;
  onSend: (arg: string) => any;
  messagesog: messageProps[];
  username: string;
  chatUiMsg: Array<any>;
  selected: (option: { key: string; text: string; backmenu: boolean }) => void;
}> = ({
  currentMessageObj,
  messagesog,
  username,
  selected,
  onSend,
  data,
  currentUser,
  setState,
}) => {
  console.log("vvv:", { messagesog, currentMessageObj });
  const [msg, setMsg] = useState([]);
  const { messages, appendMsg, setTyping, resetList } = useMessages(msg);

  const chatUIMsg = useMemo(() => {
    return currentMessageObj?.messages?.map((msg) => ({
      type: msg?.choices ? "options" : "text",
      content: { text: msg?.text, data: { ...msg } },
      position: msg?.position ?? "right",
    }));
  }, [currentMessageObj]);

  console.log("mnop:", { messages, chatUIMsg, currentMessageObj });
  console.log("mnop:", { currentMessageObj });
// useEffect(()=>{
//   onSend(currentUser?.startingMessage, null, false);
// },[])
  useEffect(() => {
    let phone = localStorage.getItem('mobile');
    if(phone === '') alert('Number required');
    const url = `http://143.110.255.220:8080/xmsg/conversation-history?provider=pwa&endDate=11-03-2023&startDate=07-03-2023&botId=${currentUser?.id}&userId=${phone}`;
   // const url = `http://143.110.255.220:8080/xmsg/conversation-history?provider=pwa&endDate=11-03-2023&startDate=07-03-2023&botId=103ceda6-8b92-4338-8615-230fe7e27472&userId=7597185708`;
    axios
      .get(url)
      .then((res) => {
        console.log("mnop res:", { res });
        if (res?.data?.result?.records?.length > 0) {
          const normalizedChats = normalizedChat(res.data.result.records);
          console.log("mnop:", { normalizedChats });
            setState((prev:any)=>({...prev,messages:normalizedChats}))
        } else {
          onSend(currentUser?.startingMessage, null, false);
        }
      })
      .catch((err) => {
        console.error("cvbn:", err);
      });
  }, []);

  useEffect(() => {
    window &&
      // window.androidInteract.onChatCompleted?.(
      window.onChatCompleted?.(
        String(currentUser?.id),
        JSON.stringify(currentMessageObj?.messages)
      );
      console.log('triggered useeffect function');
      window && console.log('window present');

  }, [currentMessageObj?.messages?.length]);

  const handleSend = useCallback(
    (type: string, val: any) => {
      if (type === "text" && val.trim()) {
        console.log("zzz:", { type, val });
        appendMsg({
          type: "text",
          content: { text: val },
          position: "right",
        });
        onSend(val, null, true);
      }
    },
    [onSend]
  );

  const renderMessageContent = useCallback(
    (msg: any) => {
      const { content, type } = msg;
      // return <Bubble content={content.text} />;
      switch (type) {
        case "text":
          return <Bubble content={content.text} />;
        case "image":
          return (
            <Bubble type="image">
              <img src={content.picUrl} alt="" />
            </Bubble>
          );

        case "options":
          return (
            <div>
              <Bubble content={content.text} />
              <div style={{ marginTop: "10px" }} />
              <ScrollView
                data={content?.data?.choices}
                // renderItem={(item:{key:string,text:string}) => <Button label={`${item.key} ${item.text}`} onClick={()=> selected({key:item.key,text:item.text,backmenu:false})}/>}
                renderItem={(item: { key: string; text: string }) => (
                  <Button
                    label={`${item.key} ${item.text}`}
                    onClick={(e) => {
                      e.preventDefault();
                      // selected({key: item.key, text: item.text, backmenu: false})
                      handleSend("text", item.key);
                    }}
                  />
                )}
              />
            </div>
          );
        default:
          return (
            <ScrollView
              data={[]}
              renderItem={(item) => <Button label={item.text} />}
            />
          );
      }
    },
    [Bubble]
  );

  return (
    <Chat
      // navbar={{ title: 'Assistant' }}
      //@ts-ignore
      messages={chatUIMsg}
      renderMessageContent={renderMessageContent}
      onSend={handleSend}
      locale="en-US"
      placeholder="Ask Your Question"
    />
  );
};

export default ChatUiWindow;
