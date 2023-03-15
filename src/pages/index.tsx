import type { NextPage } from "next";
import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Image from "next/image";
import App from "../components/App";
import React from "react";
import axios from "axios";
import PhoneView from "../components/PhoneView";
// import * as serviceWorker from "../utils/serviceWorker";
import { CookiesProvider } from "react-cookie";
// import { ColorModeScript, Flex, Box } from "@chakra-ui/react";
import NoSSR from "react-no-ssr";
import { AppContext } from "../utils/app-context";
import { find, map } from "lodash";
import { User } from "../types";
const Loading = () => <div>Loading...</div>;

const Home: NextPage = () => {
  // All Users
  const [users, setUsers] = useState<
    User[] 
  >([]);

  const [currentUser, setCurrentUser] = useState<User>();

  // useEffect(async () => {
  //   try {
  //     const url = `${process.env.NEXT_PUBLIC_UCI_BASE_URL}/admin/v1/bot/get/487e1d4f-a781-468e-b2ec-c83c3f2b2dee`;
  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //         ownerID: "95e4942d-cbe8-477d-aebd-ad8e6de4bfc8",
  //         ownerOrgID: "ORG_001",
  //       },
  //     };
  //     const {
  //       data: { result },
  //     } = await axios.get(url, config);
  //     console.log({ users: result?.data });
  //     setUsers(result?.data ?? []);
  //     setCurrentUser(result?.data?.[0]);
  //   } catch (e: any) {
  //     console.error(e.response.data);
  //   }
  // }, []);

  
// getting botList from android and fetching bot details
  useEffect(() => {
    //@ts-ignore
    try{
      const list =
      localStorage.getItem("botList") || localStorage.getItem("chatList");
      //@ts-ignore
      console.log('hjkl zxcv:',{botList:JSON.parse(list)});
      window && window?.androidInteract?.onEvent(list);
      const urls = (
        list
          ? JSON.parse(list)
          : [
              "d0dad28e-8b84-4bc9-92ab-f22f90c2432a",
              "d655cf03-1f6f-4510-acf6-d3f51b488a5e",
              "d3ed4174-3c55-4c60-b11b-facbad31a5aa",
              "487e1d4f-a781-468e-b2ec-c83c3f2b2dee",
            ]
      )
      //const urls = (list ? JSON.parse(list) : [])
      .map(
        (botId: string) =>
          `${process.env.NEXT_PUBLIC_UCI_BASE_URL}/admin/v1/bot/get/${botId}`
      );

      const config = {
        headers: {
          "Content-Type": "application/json",
          ownerID: "95e4942d-cbe8-477d-aebd-ad8e6de4bfc8",
          ownerOrgID: "ORG_001",
        },
      };
  
      const requests = urls.map((url:string) => axios.get(url, config));
      axios
        .all(requests)
        .then((responses) => {
          console.log("hjkl:", { responses });
          const usersList = responses?.map((res:any,index:number) => {
            if(index==0)
            return {...res?.data?.result?.data,active:false}
            else return {...res?.data?.result?.data,active:false}
          });
          console.log("zxcv user:", { usersList });
          window && window?.androidInteract?.onEvent(JSON.stringify(usersList));
  
          setUsers(usersList);
          console.log("onBotDetailsLoaded running now.");
          window?.androidInteract?.onBotDetailsLoaded(JSON.stringify(usersList));
          setCurrentUser(usersList?.[0]);
        })
        .catch((err) => {
          console.log("hjkl:", { err });
          window && window?.androidInteract?.onEvent(`error in fetching botDetails:${JSON.stringify(err)}`);
        });

    }catch(err){
      window && window?.androidInteract?.onEvent(`error in fetching botList:${JSON.stringify(err)}`);
    }
  }, []);

  // const onChangeCurrentUser = (name: string, number: string | null) => {
  //   const myUser = users.find((user) => {
  //     return user.name === name;
  //   }) || { name: "Farmer Bot", number: null };
  //   users.forEach((user, index) => {
  //     if (user.name === name && user.number === number) {
  //       user.active = true;
  //     } else if (user.active === true) {
  //       user.active = false;
  //     }
  //   });
  //   setCurrentUser(myUser);
  // };
  const onChangeCurrentUser=useCallback((newUser:{name:string;number:string|null})=>{
    console.log("qwerty:",{newUser})
    const currentUser=find(users,{name:newUser.name}) || { name: "Farmer Bot", number: null };
 
     users.forEach((user, index) => {
        if (user.name === newUser.name && user.name
          === newUser.name
          ) {
          user.active = true;
        } else if (user.active === true) {
          user.active = false;
        }
      });
      console.log("qwerty:",{users})
     // setCurrentUser(currentUser);
      setCurrentUser({...newUser,active:true});
    
  },[users]);

  // const onRemoveUser = (name: string, number: string | null) => {
  //   const newUsers = users.filter((user) => {
  //     return user.name !== name && user.number !== number;
  //   });
  //   setUsers(newUsers);
  //   localStorage.setItem("AllUsers", JSON.stringify(newUsers));
  // };

  // const onAddUser = (newName: string, newNumber: string | null) => {
  //   if (users.length === 0) {
  //     localStorage.setItem(
  //       "AllUsers",
  //       JSON.stringify([{ name: newName, number: newNumber, active: true }])
  //     );
  //     setUsers([{ name: newName, number: newNumber, active: true }]);
  //     return;
  //   }
  //   setUsers(
  //     (
  //       prevUsers: { name: string; number: string | null; active: boolean }[]
  //     ) => {
  //       localStorage.setItem(
  //         "AllUsers",
  //         JSON.stringify([
  //           ...prevUsers,
  //           { name: newName, number: newNumber, active: false },
  //         ])
  //       );
  //       return [
  //         ...prevUsers,
  //         { name: newName, number: newNumber, active: false },
  //       ];
  //     }
  //   );
  // };

  // New Code

  return (
    <>
      <NoSSR
        onSSR={
          <App
            currentUser={currentUser}
            allUsers={users}
            toChangeCurrentUser={onChangeCurrentUser}
          />
        }
      >
        <>
          {/*  <React.StrictMode> */}
          <Head>
            <link rel="icon" href="/favicon.ico" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <meta name="theme-color" content="black" />
            <meta name="UCI Web Channel" content="A project under C4GT" />
            <title>Farmer Bot</title>
          </Head>
          <CookiesProvider>
            <AppContext.Provider
              value={{
                currentUser,
                allUsers: users,
                toChangeCurrentUser: onChangeCurrentUser,
                
              }}
            >
              <App
                currentUser={currentUser}
                allUsers={users}
                toChangeCurrentUser={onChangeCurrentUser}
              />
            </AppContext.Provider>

            {/* <ColorModeScript /> */}
          </CookiesProvider>
          {/* </React.StrictMode> */}
        </>
      </NoSSR>
    </>
  );
};
export default Home;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
