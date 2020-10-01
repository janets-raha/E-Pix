import * as eva from '@eva-design/eva';
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, SafeAreaView } from 'react-native';
import { ApplicationProvider, Layout, Text, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import Auth from "./components/Auth";
import Navigation from './components/Navigation';


export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.dark}>
      <SafeAreaView style={{ flex: 1, marginTop: 30, marginBottom: 45 }}>
        <Navigation></Navigation>
      </SafeAreaView>
    </ApplicationProvider>
  </>
);
