import { StatusBar } from "expo-status-bar";
import React from "react";
import * as eva from '@eva-design/eva';
import { StyleSheet, View, SafeAreaView } from "react-native";
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import Navigation from './components/Navigation'


const HomeScreen = () => (
  <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

    <Text category='h1'>HOME</Text>
  </Layout>
);

export default () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <SafeAreaView style={{ flex: 1, marginTop: 30, marginBottom: 45 }} >
      <Navigation></Navigation>
    </SafeAreaView>
  </ApplicationProvider>
);
