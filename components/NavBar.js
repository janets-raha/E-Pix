import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Image } from 'react-native';
import {
  Icon,
  MenuItem,
  OverflowMenu,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

import Auth from './Auth';

export default function NavBar() {
  //
  const renderAuthMenu = () => <Auth />;

  const renderTitle = (props) => (
    <View style={styles.titleContainer}>
      <Image
        style={styles.logo}
        source={require('../assets/icon_orange.png')}
      />
      <Text {...props}>TF4#pixur</Text>
    </View>
  );

  return <TopNavigation title={renderTitle} accessoryRight={renderAuthMenu} />;
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginHorizontal: 16,
    width: 42,
    height: 42,
  },
});
