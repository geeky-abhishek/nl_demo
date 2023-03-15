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
  Popup,
} from "@chatui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "@chatui/core/dist/index.css";
import axios from "axios";
import { FC, useCallback, useEffect, useMemo, useState } from "react";


const normalizedChat = (chats: any) => {
  return chats.map((chat) => ({
    text: chat?.payload?.text,
    username: chat?.userId,
    position: chats?.messageState === "REPLIED" ? "left" : "right",
    //choices:
  }));
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
  socket,
}) => {
  console.log("vvv:", { messagesog, currentMessageObj });
  const [msg, setMsg] = useState([]);
  const [open, setOpen] = useState(false);
  const { messages, appendMsg, setTyping, resetList } = useMessages(msg);

  const chatUIMsg = useMemo(() => {
    return currentMessageObj?.messages?.map((msg) => ({
      type: msg?.choices ? "options" : "text",
      content: { text: msg?.text, data: { ...msg } },
      position: msg?.position ?? "right",
    }));
  }, [currentMessageObj]);

  console.log("ghjk:", { messages, chatUIMsg, currentMessageObj });
  
  // useEffect(()=>{
  //   onSend(currentUser?.startingMessage, null, false);
  // },[])

  useEffect(() => {
    setState((prev: any) => ({ ...prev, messages: [] }));
  }, []);

  useEffect(() => {
    let phone = localStorage.getItem("mobile");
    if (phone === "") alert("Number required");
    if (navigator.onLine) {
      const url = `http://143.110.255.220:8080/xmsg/conversation-history?provider=pwa&endDate=11-03-2023&startDate=07-03-2023&botId=${currentUser?.id}&userId=${localStorage.getItem('socketID')}`;
      //   const url = `http://143.110.255.220:8080/xmsg/conversation-history?provider=pwa&endDate=11-03-2023&startDate=07-03-2023&botId=${currentUser?.id}&userId=${phone}`;
      //  const url = `http://143.110.255.220:8080/xmsg/conversation-history?provider=pwa&endDate=11-03-2023&startDate=07-03-2023&botId=103ceda6-8b92-4338-8615-230fe7e27472&userId=7597185708`;
      axios
        .get(url)
        .then((res) => {
          console.log("ghjk res:", { res });
          if (res?.data?.result?.records?.length > 0) {
            const normalizedChats = normalizedChat(res.data.result.records);
            console.log("ghjk:", { normalizedChats });
            window && window?.androidInteract?.onEvent(JSON.stringify(normalizedChats));
            setState((prev: any) => ({ ...prev, messages: normalizedChats }));
          } else {
            onSend(currentUser?.startingMessage, null, false);
          }
        })
        .catch((err) => {
          console.error("cvbn:", err);
          window && window?.androidInteract?.onEvent(`error in fetching chat history(online):${JSON.stringify(err)}`);
        });
    } else {
      try{
        if (localStorage.getItem("chatHistory")) {
          console.log("ghjk ChatHistory:", localStorage.getItem("chatHistory"));
          window && window?.androidInteract?.onEvent(localStorage.getItem("chatHistory"));setState((prev: any) => ({
            ...prev,
            messages: localStorage.getItem("chatHistory"),
          }));
        }
      }catch(err){
        window && window?.androidInteract?.onEvent(`error in getting chat history(offline):${JSON.stringify(err)}`);
      }  }
  }, []);

  useEffect(() => {
    try{
      window && window?.androidInteract?.onChatCompleted?.(
     // window && window.onChatCompleted?.(
        String(currentUser?.id),
        JSON.stringify(currentMessageObj?.messages)
      );
      console.log("window.androidInteract.onChatCompleted");
      window && window?.androidInteract?.onEvent(JSON.stringify(currentMessageObj?.messages));
    }catch(err){
      window && window?.androidInteract?.onEvent(`error in onChatCompleted func:${JSON.stringify(err)}`);
    }

  }, [currentMessageObj?.messages?.length]);

  const handleSend = useCallback(
    (type: string, val: any) => {
      if (type === "text" && val.trim()) {
        //@ts-ignore
        onSend(val, null, true);
      }
    },
    [onSend]
  );

  const onLongPress = (content) => {
    console.log("nnnn longpress is triggered", content);
    try{
      window && window?.androidInteract?.onMsgSaveUpdate(content,'',currentUser?.id,true)
      window && window?.androidInteract?.onEvent(JSON.stringify(content));;
    }catch(er){
      window &&  window?.androidInteract?.onEvent(`error in onMsgSaveUpdate func:${JSON.stringify(err)}`);
    }
  };

  
  const renderMessageContent = useCallback(
    (msg: any) => {
      const { content, type } = msg;
      console.log({ content });
      // return <Bubble content={content.text} />;
      switch (type) {
        case "text":
          return (
            <div
              style={{ display: "flex", alignItems: "center" }}
             
            >
              <Bubble content={content.text} />
              {content?.data?.position === "right" && (
                <FontAwesomeIcon
                  icon={faStar}
                  size="lg"
                  onClick={() => onLongPress(content)}
                  color={true ? "var(--primaryyellow)" : ""}
                />
              )}
            </div>
          );
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
                scrollX
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
    <>
      <Chat
        // navbar={{ title: 'Assistant' }}
        //@ts-ignore
        messages={chatUIMsg}
        renderMessageContent={renderMessageContent}
        onQuickReplyClick={(e) => {
          console.log("vvvv:", { e });
        }}
        onSend={handleSend}
        locale="en-US"
        placeholder="Ask Your Question"
      />
      <Popup
        active={open}
        title="Message starred"
        onClose={() => setOpen(false)}
      >
        <div style={{ padding: "0px 15px" }}>
          <p style={{ padding: "10px" }}>Your message has been starred.</p>

          {/* <p style={{padding:'10px'}}>内容详情内容详情内容详情内容详情内容详情</p> */}
        </div>
      </Popup>
    </>
  );
};

export default ChatUiWindow;
