import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, ViewPager, Text } from '@ui-kitten/components';

const AppBody = () => {

    const [selectedIndex, setSelectedIndex] = React.useState(0);
  
    return (
      <ViewPager
        selectedIndex={selectedIndex}
        onSelect={index => setSelectedIndex(index)}>
        <Layout
          style={styles.tab}
          level='2'>
          <Text category='h5'>USERS   </Text>
          <Text>Bla bla vdgfbhdsfsdfbdsnfdsnfds fndbs bfd sfbdfnbsdn vsdv kjdkjvsdv dl ljds jfnsdjnfjd ldkjnvkjsd  kjdnvkjsdfkdsk  jsdbfbdjfbd  </Text>
        </Layout>
        <Layout
          style={styles.tab}
          level='2'>
          <Text category='h5'>ORDERS</Text>
        </Layout>
        <Layout
        minHeight='100%'
          style={styles.tab}
          level='2'>
          <Text category='h5'>TRANSACTIONS</Text>
        </Layout>
      </ViewPager>
    );
  };
  
  const styles = StyleSheet.create({
    tab: {
      height: 192,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default AppBody;