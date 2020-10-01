import { Layout, Card, Button, Icon } from '@ui-kitten/components';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  RefreshControl,
  processColor,
} from 'react-native';

import Searchbar from './Searchbar';

const Home = () => {
  const [homePosts, setPosts] = useState([]);
  const [fix, setFix] = useState(true);
  const [loading, setLoading] = useState(false);

  const getPictures = () => {
    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      'Client-ID ' + process.env.EXPO_CLIENT_ID
    );

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    fetch(
      'https://api.imgur.com/3/gallery/hot/time/day/1?showViral=false&mature=false&album_previews=false',
      requestOptions
    )
      .then((Response) => Response.json())
      .then((result) => {
        let res = [];
        result.data.forEach((post) => {
          let tmp = {};
          tmp.postId = post.id;
          tmp.title = post.title;
          tmp.favorite = post.favorite;
          tmp.links = [];
          let arr = [];
          if (post.images && Array.isArray(post.images)) {
            post.images.forEach((picture) => {
              arr.push({
                pictureId: picture.id,
                link: picture.link,
                type: picture.type,
                width: picture.width,
                height: picture.height,
              });
            });
            tmp.links = arr;
          } else {
            if (true || post.link) {
              arr.push({
                pictureId: post.id,
                link: post.link,
                type: post.type,
                width: post.width,
                height: post.height,
              });
            }
            tmp.links = arr;
          }
          res.push(tmp);
        });

        setPosts(res);
        setLoading(false);
        // console.log('PLOP :', res);
      });
    // .catch(error => console.error('Error :', error))
  };

  useEffect(() => {
    getPictures();
  }, [fix]);

  const backToTop = useRef();

  const backToTopIcon = (props) => {
    // console.log('Icon props :', props);
    return <Icon {...props} name="arrow-circle-up-outline" />;
  };

  return (
    <Layout>
      <Button
        title="back to top"
        style={styles.btt_button}
        accessoryRight={backToTopIcon.bind(this, {
          style: {
            width: 70,
            height: 70,
            opacity: 0.75,
            tintColor: '#F46036',
          },
        })}
        appearance="outline"
        onPress={() => {
          backToTop.current.scrollToIndex({ index: 0 });
        }}
        status="warning"
      ></Button>

      {/* <Searchbar></Searchbar> */}
      <FlatList
        ref={backToTop}
        style={{ marginTop: 70 }}
        onRefresh={getPictures}
        refreshing={loading}
        keyExtractor={(item) => item.postId}
        data={homePosts}
        renderItem={({ item }) => (
          <View style={styles.imgContainer}>
            <Text category="h3" style={styles.titre}>
              {item.title}
            </Text>
            {item.links.map((link) => {
              return (
                <Image
                  key={link.pictureId}
                  style={styles.image}
                  resizeMode="contain"
                  source={{
                    width: 370,
                    height: (link.height / link.width) * 370,
                    uri: link.link,
                  }}
                />
              );
            })}
            {/* <Button
              title="back to top"
              style={styles.btt_button}
              accessoryRight={backToTopIcon}
              appearance="ghost"
              onPress={() => {
                backToTop.current.scrollToIndex({ index: 0 });
              }}
              status="basic"
            ></Button> */}
          </View>
        )}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  imgContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginTop: 5,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#e9e9e2',
    borderRadius: 10,
  },
  image: {
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 5,
  },
  titre: {
    fontSize: 20,
    marginTop: 10,
    color: '#e9e9e2',
    textAlign: 'center',
  },
  btt_button: {
    position: 'absolute',
    width: 60,
    height: 60,
    zIndex: 3,
    bottom: 100,
    left: 30,
    marginBottom: 5,
    borderWidth: 0,
    borderRadius: 100,
  },
});

export default Home;
