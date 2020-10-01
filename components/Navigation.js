import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Layout, Tab, TabView, Text } from "@ui-kitten/components";
import Favorites from "./Favorites";
import MyPosts from "./MyPosts";
import Home from "./Home";
import NavBar from "./NavBar";
import Search from "./Search";

const Navigation = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const [token, setToken] = useState(null);
  const [loggedIn, SetLoggedIn] = useState(false);

  const getAuthFromCache = async () => {
    try {
      const cachedAuth = await AsyncStorage.getItem("auth");
      console.log("xxxauth", JSON.parse(cachedAuth));
      return JSON.parse(cachedAuth);
    } catch (e) {
      // saving error
    }
  };

  useEffect(() => {
    (async () => {
      let cachedAuth = await getAuthFromCache();
      console.log("useEffect xxxcachedAuth", cachedAuth);
      setToken(cachedAuth ? cachedAuth.access_token : null);
    })();
  }, [loggedIn]);

  const onLoggedInChange = (status) => {
    SetLoggedIn(status);
  };

  return (
    <>
      <NavBar onLoggedInChange={onLoggedInChange} />
      <TabView
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelectedIndex(index)}
      >
        <Tab title="SEARCH">
          <Search />
        </Tab>
        <Tab title="HOME">
          <Home />
        </Tab>
        <Tab title="MY PICS">
          <MyPosts />
        </Tab>
        <Tab title="FAVORITES">
          <Favorites token={token} />
        </Tab>
      </TabView>
    </>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    minHeight: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Navigation;
