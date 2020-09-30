import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import Navigation from './components/Navigation';
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, SafeAreaView } from 'react-native';
import Auth from './components/Auth';

const HomeScreen = () => (
  <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text category="h1">HOME</Text>
  </Layout>
);

export default () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <SafeAreaView style={{ flex: 1, marginTop: 30, marginBottom: 45 }}>
      {/*  <Auth /> */}
      <Navigation></Navigation>
    </SafeAreaView>
  </ApplicationProvider>
);
