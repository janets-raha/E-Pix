import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import Navigation from "./components/Navigation";
import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, SafeAreaView } from "react-native";
import Auth from "./components/Auth";
import Searchbar from "./components/Searchbar";

export default () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <SafeAreaView style={{ flex: 1, marginTop: 30, marginBottom: 45 }}>
      {/*  <Auth /> */}
      <Searchbar></Searchbar>
    </SafeAreaView>

  </ApplicationProvider>
);
