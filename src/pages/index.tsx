import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import App from '../components/App';
import React from 'react';
import axios from 'axios';
import PhoneView from '../components/PhoneView';
// import * as serviceWorker from "../utils/serviceWorker";
import { CookiesProvider } from 'react-cookie';
// import { ColorModeScript, Flex, Box } from "@chakra-ui/react";
import NoSSR from 'react-no-ssr';
const Loading = () => <div>Loading...</div>;

const Home: NextPage = () => {
  // All Users
  const [users, setUsers] = useState<
    { name: string; number: string | null; active: boolean }[]
  >([]);

  const [currentUser, setCurrentUser] = useState<{
    name: string;
    number: string | null;
  }>({});

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

  console.log('vbnm:');

  useEffect(() => {
    //@ts-ignore
    const list =
      localStorage.getItem('botList') || localStorage.getItem('chatList');
    const urls = (
      list
        ? JSON.parse(list)
        : [
            'd0dad28e-8b84-4bc9-92ab-f22f90c2432a',
            'd655cf03-1f6f-4510-acf6-d3f51b488a5e',
            'd3ed4174-3c55-4c60-b11b-facbad31a5aa',
            '487e1d4f-a781-468e-b2ec-c83c3f2b2dee',
          ]
    ).map(
      (botId: string) =>
        `${process.env.NEXT_PUBLIC_UCI_BASE_URL}/admin/v1/bot/get/${botId}`
    );
    console.log('hjkl:', { urls });
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ownerID: '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8',
        ownerOrgID: 'ORG_001',
      },
    };
    const requests = urls.map((url) => axios.get(url, config));
    axios
      .all(requests)
      .then((responses) => {
        console.log('hjkl:', { responses });
        const usersList = responses?.map((res) => res?.data?.result?.data);
        console.log('hjk user:', { usersList });
        setUsers(usersList);
        setCurrentUser(usersList?.[0]);
      })
      .catch((err) => {
        console.log('hjkl:', { err });
      });
  }, []);

  const onChangeCurrentUser = (name: string, number: string | null) => {
    const myUser = users.find((user) => {
      return user.name === name;
    }) || { name: 'Farmer Bot', number: null };
    users.forEach((user, index) => {
      if (user.name === name && user.number === number) {
        user.active = true;
      } else if (user.active === true) {
        user.active = false;
      }
    });
    setCurrentUser(myUser);
  };

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
        }>
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
            <App
              currentUser={currentUser}
              allUsers={users}
              toChangeCurrentUser={onChangeCurrentUser}
            />

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
