import { Layout, Card, Button, Icon } from '@ui-kitten/components';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  RefreshControl,
  processColor,
} from 'react-native';
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
      // fetch(
      //   'https://api.imgur.com/3/gallery/hot/?showViral=false&mature=false&album_previews=false',
      //   requestOptions
      // )
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

  // const cardHeader = (props) => (
  //   <View {...props}>
  //     <Text style={styles.header}>{props.title}</Text>
  //   </View>
  // );

  const HeartIcon = (props) => <Icon {...props} name="heart" width={30} height={30} style={{ tintColor: "red" }} />;

  const addFavorites = (favId) => {
    console.log(favId)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + auth.access_token);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
    };
    fetch('https://api.imgur.com/3/album/' + favId + '/favorite', requestOptions)
      .then(response => response.json())
      .then(result => { console.log(result) })
      .catch(error => console.log('error', error));
  }

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


  return (
    <Layout>
      {/* <Searchbar></Searchbar> */}
      <FlatList
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
            <Button style={styles.btt_button} appearance="ghost">
              ^
            </Button>
          </View>
          // <Card
          //   style={styles.card}
          //   header={cardHeader.bind(this, { title: item.title })}
          // >
          //   {item.links.map((link) => {
          //     return (
          //       <Image
          //         key={link.pictureId}
          //         resizeMode="center"
          //         source={{
          //           width: 370,
          //           height: 500,
          //           uri: link.link,
          //         }}
          //       />
          //     );
          //   })}
          // </Card>
        )}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  // Style for Card
  // topContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  // },
  // header: {
  //   fontSize: 20,
  //   marginLeft: 5,
  //   padding: 10,
  //   // height: 50,
  //   textAlignVertical: 'center',
  // },
  // card: {
  //   flex: 1,
  //   marginHorizontal: 5,
  //   marginVertical: 10,
  //   // height: 200,
  //   backgroundColor: '#e9e9e2',
  // },
  // // footerContainer: {
  // //   flexDirection: 'row',
  // //   justifyContent: 'flex-end',
  // // },
  // // footerControl: {
  // //   marginHorizontal: 2,
  // // },

  // Style like Faty
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
    // borderWidth: 2,
    // borderColor: '#e9e9e2',
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
    marginBottom: 5,
    borderWidth: 2,
    borderColor: '#e9e9e2',
    borderRadius: 100,
  },
  favHeart: {
    position: "absolute",
    backgroundColor: "transparent",
    borderColor: "transparent",
    opacity: 0.5,
    height: 20,
    width: 20,
    zIndex: 3,
    right: 20,
    bottom: 30,
    borderRadius: 60,
  }
});

export default Home;
