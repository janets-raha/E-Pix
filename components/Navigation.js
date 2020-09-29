import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Tab, TabView, Text } from '@ui-kitten/components';
import Favorites from './Favorites';
import MyPosts from './MyPosts';

const Navigation = () => {

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <TabView
      selectedIndex={selectedIndex}
      onSelect={index => setSelectedIndex(index)}>
      <Tab title='HOME'>
        <Layout
          style={styles.tabContainer}>
          <Text category='h5'>All Pics</Text>
        </Layout>
      </Tab>
      <Tab title='MY PICS'>
        <MyPosts />
      </Tab>
      <Tab title='FAVORITES'>
        <Favorites />
      </Tab>
    </TabView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Navigation;