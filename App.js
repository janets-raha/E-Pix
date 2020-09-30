import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import Navigation from "./components/Navigation";
import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <SafeAreaView style={{ flex: 1, marginTop: 30, marginBottom: 45 }}>
        <Navigation></Navigation>
      </SafeAreaView>
    </ApplicationProvider>
  </>
);
