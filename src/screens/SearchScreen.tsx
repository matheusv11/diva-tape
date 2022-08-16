import { useState, useContext } from 'react';
import { StyleSheet, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';

import { Input, Text, View, Icon, Button, RadioButton} from '../components/Themed';
import { RootTabScreenProps } from '../types';
import axios from '../utils/axios';
import { AuthContext } from '../contexts/AuthProvider';

export default function SearchScreen({ navigation }: RootTabScreenProps<'Home'>) {

  const { token } = useContext(AuthContext);
  const [songs, setSongs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [music, setMusic] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [selectedSong, setSelectedSong] = useState({});
  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  const searchSong = () => {
    axios.get(`/search-music?musica=${music}`)
    .then(res => {
      setSongs(res.data);
    })
    .catch(err => alert(err))
  }

  const getPlaylists = (song: { nome: string, thumbnail: string, musicaId: string }) => {
    setModalVisible(true);
    setSelectedSong(song)

    axios.get(`/all-playlists`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setPlaylists(res.data)
    })
    .catch(err => alert(err))
  }

  const addToPlaylist = () => {

    axios.post('/musica-playlist', {
      nome: selectedSong.name,
      thumbnail: selectedSong.thumbnail,
      musicaId: selectedSong.musicId,
      playlistId: selectedPlaylist
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setModalVisible(false);
      setSelectedPlaylist("")
      setSelectedSong("")
    })
    .catch(err => alert(err))
  }

  const playMusic = (musicId: number) => {
    navigation.navigate("Player", {
      musicList: songs,
      selected: musicId
    })
  }

  return (
    <View style={styles.container}>
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.centeredModal}>
            <View style={styles.modalView}>
              {playlists.map(play => (
                <TouchableOpacity onPress={() => setSelectedPlaylist(play.id)} key={play.id}>
                  <RadioButton style={{marginTop: 10}} selected={selectedPlaylist === play.id} label={play.nome}/>
                </TouchableOpacity>
              ))}

              <View style={styles.modalButtons}>
                <Button onPress={addToPlaylist} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}> Adicionar </Text>
                </Button>
                <Button onPress={() => setModalVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}> Fechar </Text>
                </Button>
              </View>
            </View>
          </View>
      </Modal>

      <View style={styles.searchTop}>
        <Input value={music} onChangeText={text => setMusic(text)} style={styles.input} placeholder='Música' keyboardType='default'/>
        <TouchableOpacity onPress={searchSong} style={styles.searchIcon}>
          <Icon
            name="search"
            size={38}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
      {songs.map(song => (
        <View style={styles.musicList} key={song.musicId}>
          <TouchableOpacity onPress={() => playMusic(song.musicId)}>
            <View style={styles.musicListLeft}>
              <Image source={{ uri: song.thumbnail }} style={styles.musicImage}/>
              <Text numberOfLines={4} ellipsizeMode='tail' style={styles.musicTitle}> {song.name} </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.musicListRight}>
            <TouchableOpacity onPress={() => getPlaylists(song)}>
              <Icon name="plus" size={35} style={styles.musicTrash}/>
            </TouchableOpacity>
          </View>

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
  searchTop:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 4,
    width: "100%"
  },
  searchIcon: {
    position: 'absolute',
    right: 32
  },
  input: {
    height: 45,
    borderRadius: 8,
    paddingLeft: 12,
    width: 340,
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
    width: "50%",
    flexDirection: 'row',
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