import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

const Home = ({ navigation }) => {
  // Map image names to their require paths
  const images = {
    "5.jpg": require("../../assets/images/5.jpg"),
    "9.jpg": require("../../assets/images/9.jpg"),
    "NoSearchResult.jpg": require("../../assets/images/NoSearchResult.jpg"),
  };

  const Card = ({ title, color, img }) => {
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: color }]}
        onPress={() => navigation.navigate('Road Services')}
      >
        <Image style={styles.cardImage} source={images[img]} />
        <Text style={styles.cardText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.homeHeader}>
        <Text style={styles.text}>Hello, Yasmeen</Text>
        <Image style={styles.profilePicture} source={require("../../assets/images/person.jpg")} />
      </View>

      <ScrollView horizontal style={styles.scrollViewContainer}>
        <Card title="Road Services" color="white" img="9.jpg" />
        <Card title="Consultation" color='white' img="5.jpg" />
      </ScrollView>

      <Text style={styles.requestsText}>Current Requests</Text>

      <View style={styles.requestsContainer}>
        <Image source={images["NoSearchResult.jpg"]} style={styles.image} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    margin: 2,
    backgroundColor: "rgb(251, 245, 247)",
  },
  homeHeader: {
    height: 120,
    width: '100%',
    flexDirection: "row",
    backgroundColor: "#9AB3CA",
    borderBottomRightRadius: 50,
    justifyContent: "space-between",
    alignItems: 'center',
    overflow: 'hidden',
  },
  text: {
    margin: 8,
    color: 'white',
    fontSize: 18,
    fontFamily: 'Oswald',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 15
  },
  scrollViewContainer: {
    backgroundColor: 'rgb(251, 245, 247)',
    paddingHorizontal: 10,
    marginVertical: 0,
  },
  card: {
    width: 200,
    height: 200,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  cardImage: {
    width: 200,
    height: 180,
    resizeMode: "contain"
  },
  cardText: {
    color: 'black',
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center',
    marginBottom: 3
  },
  requestsContainer: {
    // flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderTopRightRadius: 60,
    borderTopLeftRadius: 60,
    marginTop: 10,
    paddingTop: 20,
    overflow:"hidden"
  },
  requestsText: {
    margin: 5,
    color: '#3D3B3B',
    fontSize: 18,
    fontFamily: 'Oswald',
  },
  image: {
    width: "100%",
    height: 370,
    resizeMode: 'cover',
  },
});

export default Home;
