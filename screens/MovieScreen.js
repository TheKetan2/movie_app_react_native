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
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Loading from '../components/Loading';
import ProgressBar from '../components/ProgressBar';
import ProfileThumb from '../components/ProfileThumb';
import axios from 'axios';
import { URL, API_KEY } from '../const';
const screen = Dimensions.get('window');

export default function MovieScreen({ navigation, route }) {
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [director, setDirector] = useState('');
  const { movie } = route.params;

  useEffect(() => {
    setLoading(true);
    console.log(`${URL}movie/${movie.id}/credits?api_key=${API_KEY}`);
    axios
      .get(`${URL}movie/${movie.id}/credits?api_key=${API_KEY}`)
      .then((respose) => {
        console.log(respose.data.crew);
        setDirector(
          respose.data.crew.find(
            (dir) => dir.known_for_department === 'Directing'
          )
        );
        setCredits(respose.data);
        setLoading(false);
      });
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.pop()}>
          <Ionicons name="md-arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Image
          source={{
            uri: `http://image.tmdb.org/t/p/w780${movie?.backdrop_path}`,
          }}
          style={styles.banner}
        />

        <View style={styles.infoCard}>
          <Image
            source={{
              uri: `http://image.tmdb.org/t/p/w780${movie?.poster_path}`,
            }}
            style={styles.poster}
          />
          <View style={styles.textInfo}>
            <Text style={styles.title}>{movie.original_title}</Text>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>PLOT</Text>
            <Text style={{ color: 'white', fontSize: 10 }}>
              {movie.overview.length < 100
                ? movie.overview
                : movie.overview.substr(0, 100) + '...'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ProgressBar vote_average={movie.vote_average} />
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {movie.vote_average}
              </Text>
            </View>
            <>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                DIRECTOR
              </Text>
              <Text style={{ color: 'white', fontSize: 10 }}>
                {director?.name}
              </Text>
            </>
          </View>
        </View>
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
  backBtn: {
    position: 'absolute',
    left: 5,
    top: 5,
    zIndex: 100,
    width: 30,
    height: 30,
    backgroundColor: 'rgba(21,21,21,0.5)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  credit: {
    flex: 1,
    padding: 10,
  },

  infoCard: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    top: 40,
    paddingRight: 10,
    backgroundColor: 'rgba(21,21,21,0.5)',
    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  poster: {
    width: screen.width * 0.3,
  },

  textInfo: {
    left: 10,
    right: 10,
    flex: 1,
    justifyContent: 'space-evenly',
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
