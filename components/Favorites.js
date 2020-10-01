import React, { useState, useEffect } from "react";
import { Image, ScrollView, StyleSheet, FlatList, View } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import AsyncStorage from "@react-native-community/async-storage";
import { authAsync } from "expo-app-auth";

const Favorites = (props) => {
  const [fix, setFix] = useState(true);
  const [allFavs, setFavs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("PROPS", props);
    if (props.token) {
      getFav(props.token);
    } else {
      setFavs([]);
    }
    console.log("useeffect");
  }, [props]);

  const getFav = (token) => {
    if (!token) token = props.token;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(
      "https://api.imgur.com/3/account/me/gallery_favorites",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setFavs(result.data);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <Layout>
      {!props.token && <Text>Please login...</Text>}
      {props.token && (
        <FlatList
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
  imgContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  image: {
    borderWidth: 1,
    borderColor: "black",
    margin: 10,
  },
  titre: {
    textAlign: "center",
  },
});
export default Favorites;
