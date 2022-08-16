import { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Pode importar sem o * também

import { Text, View, Input, Button } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import axios from '../utils/axios'; // DEIXAR AXIOS GLOBAL

export default function RegisterScreen({ navigation }: RootTabScreenProps<'Register'>) {

  const initialRegisterForm = {
    nome: "",
    email: "",
    senha: "",
    senhaRepetida: ""
  }
  const [profilePic, setProfilePic] = useState(null); // TIPAR
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);

  const pickProfile = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) setProfilePic(result);
    
  };

  const register = () => {
    // VALIDAR CAMPOS
    const localUri = profilePic.uri;
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
  
    const formData = new FormData();
    formData.append("nome", registerForm.nome)
    formData.append("email", registerForm.email)
    formData.append("senha", registerForm.senha)
    formData.append('profilePic', { uri: localUri, name: filename, type });

    axios.post('/usuario', formData, {
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      setRegisterForm(initialRegisterForm)
      navigation.navigate('Login')
    }).catch(error=> {
      alert(error)
    })
  }

  const setStateForm = (text: any, field: string) => { // GENERALIZAR PRA MAIS EVENTOS //https://stackoverflow.com/questions/44416541/react-native-difference-between-onchange-vs-onchangetext-of-textinput
    setRegisterForm({...registerForm, [field]: text}) // TIPAR O FILED, JA QUE PODE CONFLTIAR COM STATE ACIMA, DIFERENCA DE OBJETOS
  }

  return (
    <View style={styles.container}>
      <Button onPress={pickProfile} style={styles.profilePic}>
        {profilePic ? <Image source={{ uri: profilePic.uri }} style={{ width: 80, height: 80, borderRadius: 50 }} /> : <Text> Foto </Text>}
      </Button>

      <Input value={registerForm.nome} onChangeText={text=> setStateForm(text, "nome")} style={styles.input} placeholder='Nome' keyboardType='email-address'/>
      <Input value={registerForm.email} onChangeText={text=> setStateForm(text, "email")} style={styles.input} placeholder='Email' keyboardType='email-address'/>
      <Input value={registerForm.senha} onChangeText={text=> setStateForm(text, "senha")} style={styles.input} placeholder='Senha' keyboardType='visible-password'/>
      <Input value={registerForm.senhaRepetida} onChangeText={text=> setStateForm(text, "senhaRepetida")} style={styles.input} placeholder='Repetir Senha' keyboardType='visible-password'/>
      <Button onPress={register} style={styles.loginButton}>
        <Text style={styles.title}> CADASTRAR </Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // bottom: 40,
  },
  profilePic: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    height: 80,
    width: 80,
    bottom: 70,
  },
  input: {
    height: 45,
    marginBottom: 14,
    bottom: 50,
    borderRadius: 8,
    paddingLeft: 12,
    width: 340
  },
  loginButton: {
    width: 120,
    height: 45,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});