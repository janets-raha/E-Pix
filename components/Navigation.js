import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Layout, Tab, TabView, Text } from '@ui-kitten/components';
import Favorites from './Favorites';
import MyPosts from './MyPosts';
import Home from './Home';
import NavBar from './NavBar';
import Search from './Search';

const Navigation = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const [token, setToken] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const getAuthFromCache = async () => {
    try {
      const cachedAuth = await AsyncStorage.getItem('auth');
      // console.log("xxxauth", JSON.parse(cachedAuth));
      return JSON.parse(cachedAuth);
    } catch (e) {
      alert('Issue get auth from cache in Navigation');
    }
  };

  useEffect(() => {
    (async () => {
      let cachedAuth = await getAuthFromCache();
      // console.log("Auth get from cache in Navigation", cachedAuth);
      setToken(cachedAuth ? cachedAuth.access_token : null);
    })();
  }, [loggedIn]);

  const onLoggedInChange = (status) => {
    setLoggedIn(status);
  };

  return (
    <>

      <NavBar onLoggedInChange={onLoggedInChange} />
      <TabView
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelectedIndex(index)}
        style={styles.tabContainer}
      >
        <Tab title="HOME">
          <Home />
        </Tab>
        <Tab title="MY PICS">
          <MyPosts token={token} />
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
    //maxHeight: '100%',
    flex: 2.1,

    //alignItems: 'center',
    //justifyContent: 'center',
  },
});

export default Navigation;
