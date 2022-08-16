import { useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Image} from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider'

import { Text, View, Icon} from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { AuthContext } from '../contexts/AuthProvider';
import axios from '../utils/axios';
import ytConfig from '../config/yt-music';

export default function PlaylistScreen({ navigation, route }: RootTabScreenProps<'Home'>) {

  const { token } = useContext(AuthContext);
  const [songData, setSongData] = useState({}); // OS DADOS DA MÚSICA ATUAL
  const [isPlaying, setIsPlaying] = useState(false); // STATUS DE TOQUE
  const [sound, setSound] = useState(); // OQUE TOCA
  
  const [currentPosition, setCurrentPosition] = useState(0)

  const getMusic = (musicId: number) => {
    axios.post("https://music.youtube.com/youtubei/v1/player", {videoId: musicId, ...ytConfig.playerParams })
    .then(({ data: response }) => {
      // VALIDAR SE SEMPRE EXISTE O AUDIO
      const {signatureCipher: encodedLink, url: urlVideo} = response.streamingData.adaptiveFormats
      .find(e => e.itag === 251)
  
      if(urlVideo) {
        return setSongData({
          nome: response.videoDetails.title,
          thumbnail: response.videoDetails.thumbnail.thumbnails[0].url,
          url: urlVideo
        })
      }
  
      // ENCODED
      const encodedSignature = encodedLink.split("&")[0].replace("s=", "")
      const encodedUrl = encodedLink.split("&")[2].replace("url=", "")
  
      // SIGNATURE DECODE
      const reverseSignature = decodeURIComponent(encodedSignature)
                               .split("").reverse().join("")
  
      const hydrateSignature = reverseSignature.slice(0, reverseSignature.length - 3) // USAR FILTER
  
      const splitHydrateSignature = hydrateSignature.split("")
  
      const signatureEncoded = [...splitHydrateSignature]
      signatureEncoded[48] = splitHydrateSignature[0]
      signatureEncoded[0] = splitHydrateSignature[48]
  
      //DECODED
      const decodedUrl = decodeURIComponent(encodedUrl)
      const decodedSignature = signatureEncoded.join("")
  
      const musicLink = `${decodedUrl}&sig=${decodedSignature}`

      setSongData({
        nome: response.videoDetails.title,
        thumbnail: response.videoDetails.thumbnail.thumbnails[0].url,
        url: musicLink
      })
    })
    .catch(err => {
      alert(err)
    })

    // axios.get(`/musica/${musicId}`)
    // .then(res => {
    //   setSongData(res.data)
    // })
    // .catch(err => {
    //   alert(err)
    // })
  }

  useEffect(() => {
    const { selected, musicList } = route.params // PASSAR PRA STATES?
    const musicId = musicList.find(e => e.musicId === selected).musicId
    getMusic(musicId)
  }, [])

    useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
          setSound("")
        }
      : undefined;
  }, [sound, songData]);
  
  const playSong = async () => {
    setIsPlaying(!isPlaying)

    if(sound) {
      return isPlaying ? sound.pauseAsync() : sound.playAsync();
    }

    console.log("Dados do audio", songData.url)
    const { sound: soundToPlay, status } = await Audio.Sound.createAsync(
       {
         headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36"
         },
         uri: songData.url
       }
    ).catch(e => {
      console.log("ERRO AO REPRODUZIR", e)
    });
    
    console.log("AUDIO", status)
    setSound(soundToPlay)
    console.log('Playing Sound');
    await soundToPlay.playAsync(); 
  }

  const passMusic = (forward: boolean) => {
    const { selected, musicList } = route.params;
    console.log("Selecionado", selected)
    
    const actualItem = musicList.find(e => e.musicId === selected) // REPETIDO

    console.log("Item Atual", actualItem)
    const nextItemIndex = ( musicList.indexOf(actualItem) + (forward ? 1 : - 1 ) )
    
    // NEGATIVO COMEÇA DO ULTIMO E MAIOR QUE O TAMANHO COMEÇA DO 0
    console.log("Proxima", nextItemIndex)

    // const nextMusicId =  musicList[nextItemIndex].musicId // ESSE CASO MERECIA UM LET
  
    const nextMusicId = nextItemIndex < 0 
    ? musicList[musicList.length - 1].musicId 
    : nextItemIndex > musicList.length - 1
    ? musicList[0].musicId
    : musicList[nextItemIndex].musicId

    route.params.selected = nextMusicId
    
    getMusic(nextMusicId)
    setIsPlaying(false) //PASSAR PRA OUTRO METODO DENTRO DO WATCH COM O unlick

  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: songData.thumbnail }} style={styles.songThumbnail}/>
      <Text style={styles.songTitle}> {songData.nome} </Text>

      {/* <Slider
        style={{ width: 270, height: 40}}
        minimumValue={0}
        maximumValue={1}
        
        // minimumTrackTintColor
        // maximumTrackTintColor
        // value=
      /> */}

      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => passMusic(false)}>
          <Icon name="backward" size={35} style={styles.actionIcon}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={playSong}>
          <Icon name={!isPlaying ? "play" : "pause"} size={35} style={styles.actionIcon}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => passMusic(true)}>
          <Icon name="forward" size={35} style={styles.actionIcon}/>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  songThumbnail: {
    // marginBottom: 240,
    width: 242, 
    height: 242,
  },
  actionButtons: {
    marginTop: 42,
    flexDirection: 'row',
  },
  songTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold'
  },
  actionIcon: {
    marginLeft: 20,
    marginRight: 20,
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