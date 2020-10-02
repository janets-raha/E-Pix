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
import { Video } from 'expo-av';

import AsyncStorage from '@react-native-community/async-storage';
import Searchbar from './Searchbar';

const Home = () => {
  const [homePosts, setPosts] = useState([]);
  const [fix, setFix] = useState(true);
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState(null);

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

  const HeartIcon = (props) => (
    <Icon
      {...props}
      name="heart"
      width={30}
      height={30}
      style={{ tintColor: 'red' }}
    />
  );

  const addFavorites = (favId) => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + auth.access_token);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
    };
    fetch(
      'https://api.imgur.com/3/album/' + favId + '/favorite',
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log('error', error));
  };

  const getAuthFromCache = async () => {
    try {
      const cachedAuth = await AsyncStorage.getItem('auth');
      //console.log("auth", JSON.parse(cachedAuth));
      return JSON.parse(cachedAuth);
    } catch (e) {
      // saving error
    }
  };

  useEffect(() => {
    (async () => {
      let cachedAuth = await getAuthFromCache();
      if (cachedAuth && !auth) {
        setAuth(cachedAuth);
      }
    })();
  });

  const getStyle = () => {
    return styles.favHeart;
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

            <Button
              style={styles.favHeart}
              accessoryRight={HeartIcon}
              onPress={addFavorites.bind(this, item.postId)}
            ></Button>

            {item.links.map((link) => {
              if (link.type != 'video/mp4') {
                return (
                  <>
                    <Text
                      key={link.pictureId}
                      category="p"
                      style={styles.titre}
                    >
                      {link.type}
                    </Text>

                    <Image
                      // key={link.pictureId}
                      style={styles.image}
                      resizeMode="contain"
                      source={{
                        width: 370,
                        height: (link.height / link.width) * 370,
                        uri: link.link,
                      }}
                    />
                  </>
                );
              } else {
                return (
                  <>
                    <Text
                      key={link.pictureId}
                      category="p"
                      style={styles.titre}
                    >
                      {link.type}
                    </Text>

                    <Video
                      // key={link.pictureId}
                      source={{
                        uri: link.link,
                      }}
                      rate={1.0}
                      volume={1.0}
                      resizeMode="contain"
                      useNativeControls={true}
                      shouldPlay={false}
                      isMuted={true}
                      isLooping={true}
                      // style={styles.image}
                      style={{
                        width: 370,
                        height: 370,
                        // width: 370,
                        // height: (link.height / link.width) * 370,
                        marginTop: 30,
                        marginBottom: 10,
                        borderRadius: 5,
                      }}
                    />
                  </>
                );
              }
            })}
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
    // width: 370,
    // height: (link.height / link.width) * 370,
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
  favHeart: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    opacity: 0.5,
    height: 20,
    width: 20,
    zIndex: 3,
    right: 20,
    bottom: 30,
    borderRadius: 60,
  },
});

export default Home;
