import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default ProfileThumb = ({ item }) => {
  return (
    <View style={styles.profileThumb}>
      <>
        <Image
          source={{
            uri: `http://image.tmdb.org/t/p/w342${item?.profile_path}`,
          }}
          style={styles.crewImages}
        />
      </>
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "black",
          paddingVertical: 10,
        }}
      >
        <Text style={styles.title}>{item.name}</Text>
      </View>
    </View>
  );
};
