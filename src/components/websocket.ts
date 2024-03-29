import {io} from 'socket.io-client';
// const host =
//   process.env.NODE_ENV === "production"
//     ? window.location.host
//     : "localhost:3005";


// export const socket = io(`${process.env.NEXT_PUBLIC_TRANSPORT_SOCKET_URL}`,{query: {deviceID:`phone:${localStorage.getItem("phoneNumber")}`}});
export const send = (msg: any, session: any, accessToken: any, toUser: {name: string, number: string | null}, socket:any, media:any) => {
console.log("cvbn:",{session,socketID:session.socketID})
  if (toUser.number === null || toUser.number === "null") {
    socket.emit("botRequest", {
      content: {
        text: msg,
        userId: session.userID,
        appId: "appId",
        channel: "diksha",
       from: session.socketID,
       // from: '9999404725',
        context: null,
        accessToken: accessToken,
        media:media
      },
      to: "admin",
    });
  } else {
    socket.emit("botRequest", {
      content: {
        text: msg,
        userId: session.userID,
        appId: "appId",
        channel: "diksha",
       from: session.socketID,
      // from: '9999404725',
        context: null,
        accessToken: accessToken,
      },
      to: `phone:${toUser.number}`,
    });
  }
}

export const startWebsocketConnection = (socket: any) => {
  socket.on("connect", () => {
    console.log(`opened ws connection ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log("close ws connection");
  });

  socket.on("botResponse", (arg: any) => {
    onMessageCallback && onMessageCallback(arg);
  });

  socket.on("session", (arg: any) => {
    onSessionCallback && onSessionCallback(arg);
  });
};

let onMessageCallback: (arg0: any) => any,
  onSessionCallback: (arg0: any) => any;
export const registerOnMessageCallback = (fn: (msg: any) => void) => {
  onMessageCallback = fn;
};

export const registerOnSessionCallback = (fn: (session: any) => void) => {
  onSessionCallback = fn;
};
