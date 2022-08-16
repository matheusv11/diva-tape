import { useContext, useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Text, View, Icon, Input, Button } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { AuthContext } from '../contexts/AuthProvider';
import axios from '../utils/axios';

export default function PlaylistScreen({ navigation }: RootTabScreenProps<'Home'>) {

  const { token } = useContext(AuthContext);
  const [playlist, setPlaylist] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState("");

  useFocusEffect(
    useCallback(() => {
      axios.get("/all-playlists", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setPlaylist(res.data)
      })
      .catch(err => {
        alert(err)
      })
    }, [])
  );

  const createPlaylist = () => {
    axios.post("/playlist", { nome: newPlaylist}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setPlaylist([...playlist, res.data.created]);
      setNewPlaylist("");
      setModalVisible(false)
    })
    .catch(err => {
      alert(err)
    })
  }

  const deletePlaylist = (playlistId: number) => {
    axios.delete(`/playlist/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      const filter = playlist.filter(play => play.id !== playlistId)
      setPlaylist(filter)
    })
    .catch(err => {
      alert(err)
    })
  }

  const songList = (song: object) => {
    navigation.navigate("SongList", {
      songs: song
    });
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
            <Input value={newPlaylist} onChangeText={text => setNewPlaylist(text)} style={styles.input} placeholder='Playlist' keyboardType='default'/>
            <View style={styles.modalButtons}>
              <Button onPress={createPlaylist} style={styles.closeButton}>
                <Text style={styles.closeButtonText}> Criar </Text>
              </Button>
              <Button onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}> Fechar </Text>
              </Button>
            </View>
            
          </View>
        </View>
      </Modal>

      <View style={styles.playlistTop}>
        <Text style={styles.playlistTopText}>Playlist</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon
            name="plus-circle"
            size={35}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
      {playlist.map(play => (
        <View style={styles.musicList} key={play.id}>
          <View style={styles.musicListLeft}>
            <TouchableOpacity onPress={() => songList(play)}>
              <Image source={{ uri: play.musica_playlist[0]?.thumbnail || 'https://reactjs.org/logo-og.png' }} style={styles.musicImage}/>
            </TouchableOpacity>
            <Text style={styles.musicTitle}> {play.nome} </Text>

          </View>

          <View style={styles.musicListRight}>
            <TouchableOpacity onPress={() => deletePlaylist(play.id)}>
              <Icon name="trash" size={35} style={styles.musicTrash}/>
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
    fontSize: 16,
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