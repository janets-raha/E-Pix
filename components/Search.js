// Searching using Search Bar Filter in React Native List View
// https://aboutreact.com/react-native-search-bar-filter-on-listview/

// import React in our code
import React, { useState, useEffect } from "react";

// import all the components we are going to use
import { SafeAreaView, Text, StyleSheet, View, FlatList } from "react-native";
import { SearchBar } from "react-native-elements";

const Search = (props) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const getPictures = (text) => {
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
      "https://api.imgur.com/3/gallery/search/time?q=" + text,
      requestOptions
    )
      .then((Response) => Response.json())
      .then((result) => {
        //console.log(result)
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

        props.updatePosts(res)
      })
        .catch(error => console.error('Error :', error))
  };

  let timer = null;


  const searchFilterFunction = (text) => {
    if (text) {
      if(timer) clearTimeout(timer); 
      timer = setTimeout(function(){ getPictures(text) }, 500);
    } else {
      if(timer) clearTimeout(timer); 
      props.resetPictures();
    } 
    setSearch(text);
  };

  return (
        <SearchBar
          round
          searchIcon={{ size: 24 }}
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={(text) => searchFilterFunction("")}
          placeholder="Type Here..."
          value={search}
        />
  );
};

export default Search;
