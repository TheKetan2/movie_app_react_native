import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Card } from 'react-native-paper';
import Constants from 'expo-constants';
import Loading from '../components/Loading';
import ProgressBar from '../components/ProgressBar';
import ProfileThumb from '../components/ProfileThumb';
import BackButton from '../components/BackButton';
import InfoCard from '../components/InfoCard';
const screen = Dimensions.get('window');

import { fetchCredits } from '../servises/servises';

export default function MovieScreen({ navigation, route }) {
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [director, setDirector] = useState('');
  const { movie } = route.params;

  useEffect(() => {
    setLoading(true);
    fetchCredits(movie.id).then((data) => {
      setCredits(data.credits);
      setDirector(data.director);
      setLoading(false);
    });
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <View>
        <BackButton navigation={navigation} />
        <Image
          source={{
            uri: `http://image.tmdb.org/t/p/w780${movie?.backdrop_path}`,
          }}
          style={styles.banner}
        />
        <InfoCard movie={movie} director={director} />
      </View>
      <View style={styles.credit}>
        <>
          <Text style={styles.title}>CAST</Text>
          {credits && (
            <FlatList
              data={credits.cast}
              renderItem={({ item }) => <ProfileThumb item={item} />}
              horizontal
            />
          )}
        </>
        <>
          <Text style={styles.title}>CREW</Text>
          {credits && (
            <FlatList
              data={credits.crew}
              renderItem={({ item }) => <ProfileThumb item={item} />}
              horizontal
            />
          )}
        </>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { width: Constants.width, height: 200 },

  credit: {
    flex: 1,
    padding: 10,
  },

  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#212121',
  },

  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
