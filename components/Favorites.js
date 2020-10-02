import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, FlatList, View } from 'react-native';
import { Button, Layout, Text, Icon } from '@ui-kitten/components';

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
      .then((result) => setFavs(result.data))
      .catch((error) => alert('Issue fetching favorites: ', error));
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
        <FlatList
          style={styles.flatlist}
          onRefresh={getFav}
          refreshing={loading}
          keyExtractor={(item) => item.id}
          data={allFavs}
          renderItem={({ item }) => {
            return (
              <View key={item.id} style={styles.imgContainer}>
                <Text category="h3" style={styles.titre}>
                  {item.title}
                </Text>
                <Button
                  id={item.id}
                  style={styles.button}
                  accessoryRight={CrossIcon}
                  onPress={removeFav.bind(this, item.id)}
                ></Button>
                {item.images.map((img) => {
                  return (
                    <Image
                      key={img.id}
                      style={styles.image}
                      resizeMode="contain"
                      source={{
                        width: 370,
                        height: (img.height / img.width) * 370,
                        uri: img.link,
                      }}
                    />
                  );
                })}
              </View>
            );
          }}
        />
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
    borderWidth: 1,
    borderColor: 'black',
    margin: 10,
  },
  /*titre: {
    textAlign: "center",
  },*/
  titre: {
    fontSize: 25,
    marginTop: 10,
    color: '#e9e9e2',
    textAlign: 'center',
  },
  container: {
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
