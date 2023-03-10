// import '@chatui/core/es/styles/index.less';
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
import { FC, useCallback, useEffect, useMemo, useState } from "react";

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
  data?:any;
  onSend: (arg:string) => any;
  messagesog: messageProps[];
  username: string;
  chatUiMsg: Array<any>;
  selected: (option: { key: string; text: string; backmenu: boolean }) => void;
}> = ({ currentMessageObj, messagesog, username, selected, onSend ,data}) => {
  console.log("vvv:", { messagesog, currentMessageObj });
  const [msg, setMsg] = useState([]);
  const { messages, appendMsg, setTyping, resetList } = useMessages(msg);

  const chatUIMsg = useMemo(() => {
    return currentMessageObj?.messages?.map((msg) => ({
      type: msg?.choices ? "options" : "text",
      content: { text: msg?.text, data: { ...msg } ,},
      position:msg?.position ?? 'right'
    }));
  }, [currentMessageObj]);

  console.log("zzz:", { messages, chatUIMsg ,currentMessageObj});

useEffect(()=>{
 window && window.onChatCompleted?.(22222,JSON.stringify(currentMessageObj?.messages));
},[currentMessageObj?.messages?.length,window]);

  const handleSend = useCallback(
    (type: string, val: any) => {
     
      if (type === "text" && val.trim()) {
        console.log("zzz:",{type,val})
        appendMsg({
          type: "text",
          content: { text: val },
          position: "right",
        });
        onSend(val,null,true);
       
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
             <div style={{marginTop:'10px'}}/>
            <ScrollView
              data={content?.data?.choices}
              // renderItem={(item:{key:string,text:string}) => <Button label={`${item.key} ${item.text}`} onClick={()=> selected({key:item.key,text:item.text,backmenu:false})}/>}
              renderItem={(item:{key:string,text:string}) => <Button label={`${item.key} ${item.text}`} onClick={(e)=>{
                e.preventDefault();
               // selected({key: item.key, text: item.text, backmenu: false})
               handleSend('text',item.key)
              }}/>}
            
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
