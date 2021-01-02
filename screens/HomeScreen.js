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
import { EvilIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import axios from 'axios';

import Loading from '../components/Loading';

import { URL, API_KEY } from '../const';

const screen = Dimensions.get('screen');

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  //fetches movie and stores them in movies state
  const fetchMovies = () => {
    console.log('fetch movies');
    setLoading(true);
    if (search.length === 0) {
      axios
        .get(`${URL}movie/popular?api_key=${API_KEY}&page=${page}`)
        .then((respose) => {
          setMovies([...movies, ...respose.data.results]);
          console.log('aah: ', JSON.stringify(respose.data.results[0]));
          setLoading(false);
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .get(
          `${URL}search/movie?api_key=${API_KEY}&language=en-US&query=${search}`
        )
        .then((respose) => {
          setMovies(respose.data.results);
          console.log(JSON.stringify(respose.data.results[0]));
          setLoading(false);
        })
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    fetchMovies(search);
    console.log('hihii');
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <View>
        <Image
          source={{
            uri: `http://image.tmdb.org/t/p/w780${movies[0]?.backdrop_path}`,
          }}
          style={styles.banner}
        />
        <View style={styles.bannerInfoCard}>
          <Text style={styles.bannerTitle}>
            {movies[0]?.original_title.substr(0, 20)}
          </Text>
          <Text style={styles.bannerOverview}>
            {movies[0]?.overview.substr(0, 80) + '...'}
          </Text>
        </View>
      </View>

      <View>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder={'search movies'}
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
          <TouchableOpacity
            onPress={() => {
              console.log('pressed');
              fetchMovies();
            }}>
            <EvilIcons
              name={search ? 'search' : 'refresh'}
              size={20}
              color="black"
              style={{ alignSelf: 'center', marginHorizontal: 20 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.movieListCard}>
          <FlatList
            data={movies}
            numColumns={2}
            renderItem={({ item, index }) => {
              return (
                <Card style={styles.movieCard}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Movie', { movie: item })
                    }>
                    <Image
                      source={{
                        uri: `http://image.tmdb.org/t/p/w780${item.poster_path}`,
                      }}
                      style={{ width: Constants.width, height: 200 }}
                    />
                  </TouchableOpacity>
                </Card>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  banner: { width: Constants.width, height: 200 },
  bannerInfoCard: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 50,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(21,21,21,0.5)',
  },
  bannerTitle: {
    color: 'white',
    fontSize: 16,
    letterSpacing: 1.2,
  },
  bannerOverview: {
    color: 'grey',
  },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#212121',
  },
  inputCard: {
    position: 'absolute',
    top: -40,
    margin: 20,
    left: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 5,
    zIndex: 100,
  },
  input: {
    padding: 10,
    flex: 1,
  },
  movieCard: {
    flex: 1,
    height: 200,
    margin: 5,
    alignSelf: 'center',
    overflow: 'hidden',
    borderWidth: 5,
  },
  movieListCard: {
    top: screen.height * 0.05,
  },
});
