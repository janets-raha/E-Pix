import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-community/async-storage";

export default function Auth() {
  const [auth, setAuth] = useState();

  const openAuthSessionAsync = async () => {
    try {
      let result = await WebBrowser.openAuthSessionAsync(
        `https://api.imgur.com/oauth2/authorize?client_id=a7b0a9091b77d8e&response_type=token&state=anystring`
      );
      const auth = {};
      if (result.url) {
        const authArray = result.url
          .substring(result.url.indexOf("#") + 1)
          .split("&");
        authArray.forEach((element) => {
          let q = element.split("=");
          auth[q[0]] = q[1];
        });
      }
      setAuth(auth);
      storeData(auth);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("auth", JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  };

  const maybeRenderRedirectData = () => {
    if (!auth) {
      return;
    }
    return <Text style={{ marginTop: 30 }}>{JSON.stringify(auth)}</Text>;
  };

  return (
    <View style={styles.container}>
      <Button onPress={openAuthSessionAsync} title="Login with Imgur" />
      {maybeRenderRedirectData()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
});
