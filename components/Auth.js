import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Icon,
  MenuItem,
  OverflowMenu,
  Text,
  Button,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

const MenuIcon = (props) => <Icon {...props} name="more-vertical" />;

const InfoIcon = (props) => <Icon {...props} name="info" />;

const LogoutIcon = (props) => <Icon {...props} name="log-out" />;

export default function Auth() {
  //
  const [auth, setAuth] = useState(null);

  const getAuthFromCache = async () => {
    try {
      const cachedAuth = await AsyncStorage.getItem("auth");
      console.log("auth", JSON.parse(cachedAuth));
      return JSON.parse(cachedAuth);
    } catch (e) {
      // saving error
    }
  };

  useEffect(() => {
    (async () => {
      let cachedAuth = await getAuthFromCache();
      if (cachedAuth && !auth) {
        setAuth(cachedAuth);
      }
    })();
  }, []);

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('auth', JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  };

  const handleRedirect = (event) => {
    if (Constants.platform.ios) {
      WebBrowser.dismissBrowser();
    } else {
      removeLinkingListener();
    }
    const auth = {};
    if (event.url) {
      const authArray = event.url
        .substring(event.url.indexOf('#') + 1)
        .split('&');
      authArray.forEach((element) => {
        let q = element.split('=');
        auth[q[0]] = q[1];
      });
    }
    setAuth(auth);
    storeData(auth);
  };

  const openBrowserAsync = async () => {
    try {
      console.log('clt', process.env.EXPO_CLIENT_ID);
      addLinkingListener();
      let result = await WebBrowser.openBrowserAsync(
        `https://api.imgur.com/oauth2/authorize?client_id=${process.env.EXPO_CLIENT_ID}&response_type=token&state=anystring`
      );
      if (Constants.platform.ios) {
        removeLinkingListener();
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const addLinkingListener = () => {
    Linking.addEventListener('url', handleRedirect);
  };

  const removeLinkingListener = () => {
    Linking.removeEventListener('url', handleRedirect);
  };

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
  );

  async function logout() {
    console.log('logou');
    const removed = await AsyncStorage.removeItem('auth');
    setAuth(null);
    toggleMenu();
  }

  return (
    <>
      <View style={styles.container}>
        {!auth && (
          <Button onPress={openBrowserAsync} style={styles.login}>
            Login with imgur
          </Button>
        )}
        {auth && (
          <>
            <View style={styles.alternativeContainer}>
              <Text onPress={toggleMenu} appearance="alternative">
                {auth.account_username}
              </Text>
            </View>
          </>
        )}
      </View>
      <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}
      >
        <MenuItem
          accessoryLeft={LogoutIcon}
          title="Logout"
          onPress={logout}
          style={{ padding: 20, textSize: 30 }}
        />
      </OverflowMenu>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  login: {
    backgroundColor: 'green',
  },
  alternativeContainer: {
    borderRadius: 4,
    marginVertical: 2,
    backgroundColor: "#3366FF",
  },
});
