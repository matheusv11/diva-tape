import { useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';

import { Text, View, Icon, Input, Button } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { AuthContext } from '../contexts/AuthProvider';
import axios from '../utils/axios';

export default function PlaylistScreen({ navigation,route }: RootTabScreenProps<'Home'>) {

  const { token } = useContext(AuthContext);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    setSongs(route.params.songs.musica_playlist)
  }, [])

  const playMusic = (musicId: string) => {
    navigation.navigate("Player", {
      musicList: songs.map(e => {
        e.musicId = e.musica_id
        return e
      }),
      selected: musicId
    })
  }

  return (
    <View style={styles.container}>

      <ScrollView>
        {songs.map(song => (
            <View style={styles.musicList} key={song.id}>

              <TouchableOpacity onPress={() => playMusic(song.musica_id)}>
                <View style={styles.musicListLeft}>
                    <Image source={{ uri: song.thumbnail }} style={styles.musicImage}/>
                    <Text style={styles.musicTitle}> {song.nome} </Text>

                </View>
              </TouchableOpacity>

            </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  playlistTop:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    width: "100%"
  },
  playlistTopText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  musicList: {
    flexDirection: 'row',
    width: "100%",
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  musicListLeft: {
    flexDirection: 'row',
    width: "50%",
    alignItems: 'center',
  },
  musicListRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  musicImage: {
    width: 112, 
    height: 112,
    marginLeft: 18,
  },
  musicTitle: {
    marginLeft: 6,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "bold"
  },
  musicTrash: {
    // marginHorizontal: 
  },
  input: {
    height: 45,
    borderRadius: 8,
    paddingLeft: 12,
    width: 340,
  },
  closeButton: {
    width: 120,
    top: 20,
    marginLeft: 12,
    marginRight: 12,
    height: 45,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalButtons: {
    flexDirection: 'row'
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  centeredModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'transparent',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalView: {
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});