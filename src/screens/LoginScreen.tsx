import { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, Input, Button } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { AuthContext } from '../contexts/AuthProvider';

export default function LoginScreen({ navigation }: RootTabScreenProps<'Login'>) {

  const { login } = useContext(AuthContext)

  const initialLoginForm = {
    email: "",
    senha: ""
  }

  const [loginForm, setLoginForm] = useState(initialLoginForm)

  const handleLogin = () => {
    login(loginForm.email, loginForm.senha)
  }

  return (
    <View style={styles.container}>
      <Input value={loginForm.email} onChangeText={text => setLoginForm({...loginForm, email: text})} style={styles.input} placeholder='Email' keyboardType='email-address'/>
      <Input value={loginForm.senha} onChangeText={text => setLoginForm({...loginForm, senha: text})} style={styles.input} placeholder='Senha' keyboardType='visible-password'/>
      <Button onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.title}> ENTRAR </Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 45,
    marginBottom: 14,
    bottom: 40,
    borderRadius: 8,
    paddingLeft: 12,
    width: 340,
  },
  loginButton: {
    width: 120,
    height: 45,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
