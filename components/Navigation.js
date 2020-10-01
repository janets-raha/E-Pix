import React from "react";
import { StyleSheet } from "react-native";
import { Layout, Tab, TabView, Text } from "@ui-kitten/components";
import Favorites from "./Favorites";
import MyPosts from "./MyPosts";
import Home from "./Home";
import NavBar from "./NavBar";
import Search from "./Search";

const Navigation = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  return (
    <>
      <NavBar />
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
          <Favorites />
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
