import { createContext, useEffect, useState } from "react";
import axios from '../utils/axios';
import { useNavigation } from "@react-navigation/native";
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({});

function AuthProvider({ children }){
    const [token, setToken] = useState("");
    const [userInfo, setUserInfo] = useState({});
    const navigation = useNavigation();

    function login(email: string, password: string) {
        axios.post('/auth', { email: email, senha: password })
        .then(async res => {
          await AsyncStorage.setItem('token', res.data.acessToken)
          setToken(res.data.acessToken)
          navigation.dispatch(StackActions.replace('Home'))
          getUserInfo(res.data.acessToken)
        }).catch(error=> {
          console.log("ERROR", error)
          alert(error)
        })
    }

    async function logout() {
      setToken("")
      await AsyncStorage.setItem('token', "")
      navigation.dispatch(StackActions.replace("Root"));
    }

    function getUserInfo(localToken?: string) {
      axios.get('/user-info', {
        headers: {
          Authorization: `Bearer ${localToken}`
        }
      })
      .then(res => {
        setUserInfo(res.data)
      })
      .catch(err => {
        alert(err)
      })
    }

    useEffect(() => {

      const validateToken = (token?: string) => {
        return axios.get('/validate-token', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(() => true)
        .catch(() => false)
      }

      const getLocalToken = async () => {
        const tokenStorage = await AsyncStorage.getItem("token")

        if(tokenStorage && !(await validateToken(tokenStorage)) ){
          // setToken("")
          // await AsyncStorage.setItem('token', '')
          navigation.dispatch(StackActions.replace('Root'))
        }

        if(!token && tokenStorage && await validateToken(tokenStorage)) {
          setToken(tokenStorage)
          navigation.dispatch(StackActions.replace('Home'))
          getUserInfo(tokenStorage)
        }
      }

      getLocalToken();

    }, [])

    return(
        <AuthContext.Provider value={{ nome: "JOSÉ", login, token, logout, userInfo}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;