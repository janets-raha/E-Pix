import React, { useState, useEffect, useRef } from "react";
import { Image, StyleSheet, FlatList, View } from "react-native";
import { Layout, Text, Button, Icon, Input } from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";


const MyPosts = (props) => {
  const [fix, setFix] = useState(true);
  const [allPosts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [imageTitle, setImageTitle] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.token) {
      getPosts(props.token);
    } else {
      getPosts([]);
    }
    //console.log("useeffect");
  }, [props]);

  const getPosts = (token) => {
    if (!token) token = props.token;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch("https://api.imgur.com/3/account/me/images", requestOptions)
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

        setPosts(res);
        setLoading(false);
      })
      .catch((error) => console.log("error", error));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.base64);
      //(result.base64)
    }
  };

  const handleChange = (event) => {
    setImageTitle(event);
  };

  const uploadImage = () => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer " + props.token
      // 'Bearer 5eeae49394cd929e299785c8805bd168fc675280'
    );

    var formdata = new FormData();
    formdata.append("type", "base64");
    formdata.append("title", imageTitle);
    formdata.append("image", image);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("https://api.imgur.com/3/upload", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        //console.log("retour upload", result);
        getPosts();
        setImage(null);
      })
      .catch((error) => console.log("error", error));
  };

  const CloudIcon = (props) => (
    <Icon {...props} name="cloud-upload" width={40} height={40} />
  );
  const CrossIcon = (props) => (
    <Icon {...props} name="close" width={30} height={30} />
  );

  const removePost = (postId) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + props.token);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://api.imgur.com/3/image/" + postId, requestOptions)
      .then((response) => response.text())
      .then((result) => getPosts(props.token))
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, [fix]);

  const backToTop = useRef();

  const backToTopIcon = (props) => {
    // console.log('Icon props :', props);
    return <Icon {...props} name="arrow-circle-up-outline" />;
  };

  return (
    <Layout style={styles.layout}>
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
                tintColor: "#F46036",
              },
            })}
            appearance="outline"
            onPress={() => {
              if (allPosts.length)
                backToTop.current.scrollToIndex({ index: 0 });
            }}
            status="warning"
          ></Button>
          <Button
            style={styles.button}
            accessoryRight={CloudIcon}
            onPress={pickImage}
            status="success"
          ></Button>

          {image && (
            <Layout style={styles.inputGrp}>
              <Input
                size="large"
                style={styles.input}
                onChangeText={handleChange}
                placeholder="Indiquer le titre de l'image"
                status="danger"
              />
              <Button style={styles.buttonOk} onPress={uploadImage}>
                OK
              </Button>
            </Layout>
          )}
          <FlatList
            ref={backToTop}
            style={{ marginTop: 10 }}
            onRefresh={getPosts}
            refreshing={loading}
            keyExtractor={(item) => item.postId}
            data={allPosts}
            renderItem={({ item }) => (
              <View style={styles.imgContainer}>
                <Text category="h3" style={styles.titre}>
                  {item.title}
                </Text>
                <Button
                  id={item.id}
                  style={styles.delete}
                  accessoryRight={CrossIcon}
                  onPress={removePost.bind(this, item.postId)}
                ></Button>

                {item.links.map((link) => {
                  if (link.type != "video/mp4") {
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
                        isMuted={true}
                        resizeMode="contain"
                        useNativeControls={true}
                        showFullscreenButton={false}
                        shouldPlay={true}
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

                    );
                  }
                })}
              </View>
            )}
          />
        </>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    //marginBottom: 50
  },
  container: {
    minHeight: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imgContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    marginTop: 5,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: "#e9e9e2",
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
    color: "#e9e9e2",
    textAlign: "center",
  },
  btt_button: {
    position: "absolute",
    width: 60,
    height: 60,
    zIndex: 3,
    bottom: 35,
    left: 30,
    //marginBottom: 5,
    borderWidth: 0,
    borderRadius: 100,
  },
  inputGrp: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    width: '85%',
  },
  buttonOk: {
    height: 50,
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
  },
  button: {
    position: "absolute",
    backgroundColor: "rgba(51, 139, 255, 0.67)",
    height: 60,
    width: 60,
    zIndex: 3,
    bottom: 35,
    right: 20,
    borderRadius: 60,
    //bottom: 20, // A sensible offset from the edge of the viewport
  },
  delete: {
    position: "absolute",
    backgroundColor: "rgba(219, 0, 0, 0.78)",
    opacity: 0.5,
    height: 20,
    width: 20,
    zIndex: 3,
    right: 20,
    bottom: 30,
    borderRadius: 60,
  },
});

export default MyPosts;
