import React, { useState, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

const Favorites = () => {
  const [fix, setFix] = useState(true);
  const [allFavs, setFavs] = useState([]);

  const getFav = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer dd9992fb5967dc1c56fe1362d2f22cf177f94c82");
    //myHeaders.append("Cookie", "amplitude_id_f1fc2abcb6d136bd4ef338e7fc0b9d05imgur.com=eyJkZXZpY2VJZCI6ImJmN2JkY2NjLWU1YTUtNGRhMy1iYTExLTNhMDUxNGVlMWEwYVIiLCJ1c2VySWQiOm51bGwsIm9wdE91dCI6ZmFsc2UsInNlc3Npb25JZCI6MTYwMTMxNjM0ODI0NywibGFzdEV2ZW50VGltZSI6MTYwMTMxNjM0ODI1MywiZXZlbnRJZCI6MCwiaWRlbnRpZnlJZCI6Miwic2VxdWVuY2VOdW1iZXIiOjJ9; IMGURUIDJAFO=ae72212599015021f8bf926835b4329e4a44d8aeb6f10f5e7673fc9ee77ea007; SESSIONDATA=%7B%22sessionCount%22%3A1%2C%22sessionTime%22%3A1601316348367%7D; _ga=GA1.2.154282965.1601316348; _gid=GA1.2.1129595793.1601316348; __auc=57059161174d5e4627c31a8a32f; _fbp=fb.1.1601316348853.519716243; addtl_consent=1~39.4.3.9.6.5.4.13.6.4.15.9.5.2.7.4.1.7.1.3.2.10.3.5.4.13.8.4.6.9.7.10.2.9.2.12.6.7.6.14.5.20.6.5.1.3.1.11.29.4.14.4.4.1.3.10.6.2.9.6.6.4.5.3.1.4.29.4.5.3.1.6.2.2.17.1.17.10.9.1.8.3.3.2.8.1.2.1.3.142.4.8.35.7.15.1.14.3.1.8.10.14.11.3.7.25.5.18.9.7.41.2.4.18.21.3.4.2.1.6.6.5.2.14.18.7.3.2.2.8.19.1.8.8.6.3.10.4.5.15.2.4.9.3.1.6.4.11.1.3.18.4.16.2.6.8.2.4.11.6.5.5.12.16.11.8.1.10.28.8.4.1.3.21.2.7.6.1.9.30.17.4.9.15.8.7.3.6.6.7.2.4.1.7.12.10.3.22.13.2.12.2.4.6.1.4.15.2.4.9.4.5.1.3.7.13.5.3.12.4.13.4.14.8.2.15.2.5.5.1.2.2.1.1.1.14.7.4.8.2.9.9.1.18.12.13.2.18.1.1.3.1.1.9.20.5.4.6.14.8.4.5.3.5.4.8.4.2.2.2.14.2.13.4.2.6.9.6.3.4.3.5.2.3.6.10.11.2.4.3.16.3.8.3.3.1.2.3.9.19.11.15.3.10.7.6.4.3.4.9.3.3.3.1.1.1.6.11.3.1.1.7.4.3.3.1.10.5.2.6.3.2.1.1.4.3.2.2.7.2.13.7.12.2.1.6.4.5.4.3.2.2.4.1.3.1.1.1.5.6.1.6.9.1.4.1.2.1.7.2.8.3.8.1.3.1.1.2.1.3.2.6.1.5.6.1.5.3.1.3.1.1.2.2.7.7.1.4.1.2.6.1.2.1.1.3.1.1.4.1.1.2.1.8.1.3.4.4.1.2.2.1.3.1.4.3.9.6.1.15.10.28.1.2.1.1.12.3.4.1.5.1.3.4.7.1.3.1.1.3.1.5.3.1.3.2.2.1.1.4.2.1.2.1.1.1.2.2.4.2.1.2.2.2.4.1.1.1.2.1.1.1.1.1.1.1.1.1.1.1.2.2.1.1.2.1.2.1.7.1.2.1.1.1.2.1.1.1.1.2.1.1.3.2.1.1.2.6.1.1.1.5.2.1.6.5.1.1.1.1.1.2.1.1.3.1.1.4.1.1.2.2.1.1.4.2.1.1.2.3.2.1.2.3.1.1.1.1.4.1.1.1.5.1.8.1.3.1.5.1.1.3.2.1.1.1.2.3.1.4.2.1.2.2.2.1.1.1.1.1.1.11.1.3.1.1.2.2.1.4.2.2.1.2.1.4.1.1.1.1.1.3.2.1.1.2.5.1.3.6.4.1.1.3.1.4.3.1.2.2.5.1.7.4.1.2.1.1.1.4.2.1; euconsent-v2=CO6dXvgO6dXvgAKANAENA5CsAP_AAH_AAAwIGvNd_X_fb2_j-_5999t0eY1f9_6_v2wzjgeds-8Nyd_X_L8X62MyvB36pq4KuR4Eu3LBAQFlHOHcTQmQ4IkVqTLsbk2Mq7NKJ7LEilMbM2dYGHtPn9XTuZKY707s___z_3-_-___77f_r-3_3_A14Akw1L4CDMSxgJJo0qhRAhCuJDoAQAUUIwtElhASuCnZXAR6ggQAIDUBGBECDEFGLIIAAAAAkoiAEgPBAIgCIBAACAFaAhAARIAgsAJAwCAAUA0LACKIJQJCDI4KjlECAqRaKCeSMCSC52MMIAAA.f_gAAAAAAAAA; accesstoken=b62cd374fe5874b65349c8b237069f77256db662; is_authed=1");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    fetch("https://api.imgur.com/3/account/me/gallery_favorites", requestOptions)
      .then(response => response.json())
      .then(result => { setFavs(result.data) })
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    getFav()
  }, [fix])

  return (
    <Layout >
      <ScrollView>
        <Text >Contenu de la page favorites</Text>
        <View style={styles.imgContainer}>
          {
            allFavs.map(fav => {
              return (
                <View key={fav.id} style={styles.imgContainer}>
                  <Text category='h3'>{fav.title}</Text>
                  {
                    fav.images.map(img => {
                      return (
                        <Image
                          key={img.id}
                          resizeMode='contain'
                          source={{
                            width: 370,
                            height: 500,
                            uri: img.link
                          }} />
                      )
                    })
                  }
                </View>
              )
            })
          }
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  imgContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
  },
  oneFav: {

  }
});
export default Favorites;