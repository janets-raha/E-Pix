import React, { useState, useEffect, useRef } from 'react';
import { Image, StyleSheet, FlatList, View } from 'react-native';
import { Button, Layout, Text, Icon } from '@ui-kitten/components';
import { Video } from 'expo-av';

const Favorites = (props) => {
  const [fix, setFix] = useState(true);
  const [allFavs, setFavs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.token) {
      getFav(props.token);
    } else {
      setFavs([]);
    }
    // console.log('useeffect');
  }, [props]);

  const getFav = (token) => {
    if (!token) token = props.token;
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    fetch(
      'https://api.imgur.com/3/account/me/gallery_favorites',
      requestOptions
    )
      .then((response) => response.json())
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

        setFavs(res);
        setLoading(false);
        //console.log('FAV:', res);
      })

      .catch((error) => alert('Issue fetching favorites: ', error));
  };
  const backToTop = useRef();

  const backToTopIcon = (props) => {
    // console.log('Icon props :', props);
    return <Icon {...props} name="arrow-circle-up-outline" />;
  };

  const CrossIcon = (props) => (
    <Icon {...props} name="close" width={30} height={30} />
  );

  const removeFav = (favId) => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + props.token);

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
        getFav(props.token);
      })
      .catch((error) => console.log('error', error));
  };

  return (
    <Layout>
      {!props.token && (
        <View style={styles.container}>
          <Text category="h4">Please login...</Text>
        </View>
      )}
      {props.token && (
        <>
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
          <FlatList
            style={styles.flatlist}
            onRefresh={getFav}
            refreshing={loading}
            keyExtractor={(item) => item.postId}
            data={allFavs}
            renderItem={({ item }) => {
              return (
                <View key={item.id} style={styles.imgContainer}>
                  <Text category="h3" style={styles.titre}>
                    {item.title}
                  </Text>
                  <Button
                    style={styles.button}
                    accessoryRight={CrossIcon}
                    onPress={removeFav.bind(this, item.postId)}
                  ></Button>
                  {item.links.map((link) => {
                    if (link.type.substr(0, 5) == 'image') {
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
                    } else {
                      return (
                        <Video
                          key={link.pictureId}
                          source={{
                            uri: link.link,
                          }}
                          rate={1.0}
                          volume={1.0}
                          resizeMode="contain"
                          useNativeControls={true}
                          shouldPlay={false}
                          isMuted={false}
                          isLooping={true}
                          // style={styles.image}
                          style={{
                            // width: 370,
                            // height: 370,
                            width: 370,
                            height: (link.height / link.width) * 370,
                            marginTop: 30,
                            marginBottom: 10,
                            borderRadius: 5,
                          }}
                        />
                      );
                    }

                  })}
                </View>
              );
            }}
          />
        </>
      )}
    </Layout>
  );

};

const styles = StyleSheet.create({
  /* imgContainer: {
     display: "flex",
     flexDirection: "column",
     alignItems: "center",
     justifyContent: "center",
     marginBottom: 30,
   },*/
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
  /*titre: {
    textAlign: "center",
  },*/
  titre: {
    fontSize: 20,
    marginTop: 10,
    color: '#e9e9e2',
    textAlign: 'center',
  },
  container: {
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btt_button: {
    position: 'absolute',
    width: 60,
    height: 60,
    zIndex: 3,
    bottom: 35,
    left: 30,
    marginBottom: 5,
    borderWidth: 0,
    borderRadius: 100,
  },
  button: {
    position: 'absolute',
    backgroundColor: 'rgba(219, 0, 0, 0.78)',
    opacity: 0.5,
    height: 20,
    width: 20,
    zIndex: 3,
    right: 20,
    bottom: 30,
    borderRadius: 60,
  },
  flatlist: {
    marginVertical: 10

  },
});
export default Favorites;
