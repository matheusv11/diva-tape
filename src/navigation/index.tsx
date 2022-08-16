/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { useContext } from 'react';
import { Button } from '../components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator, BottomTabBar} from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ColorSchemeName, View, ImageBackground, Pressable, Image } from 'react-native';
import AuthProvider from '../contexts/AuthProvider';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ProfileScreen from '../screens/ProfileScreen';
import SongsScreen from '../screens/SongsScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import PlaylistScreen from '../screens/PlaylistScreen';
import PlayerScreen from '../screens/PlayerScreen';
import SearchScreen from '../screens/SearchScreen';
import { AuthContext } from '../contexts/AuthProvider';

import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <IndexNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function IndexNavigator() {
  return (
    <Stack.Navigator>
      {/* <Stack.Group>
        <Stack.Screen name="Login" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={BottomTabNavigator} options={{ headerShown: false }} />
      </Stack.Group> */}
      <Stack.Screen name="Root" component={RootNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ProfileScreen} />
        <Stack.Screen name="SongList" component={SongsScreen} />
        <Stack.Screen name="Player" component={PlayerScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

const CustomBarButton = ({children, onPress}) => (
  <Button
    style={{
      marginTop: 16,
      marginLeft: 12,
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      width: 180,
      height: 50,
      borderRadius: 8
    }}
    onPress={onPress}
  >
    {children}
  </Button>
)

const CustomTabBar = props => (
    <BottomTabBar {...props} />
)

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function RootNavigator() {
  const colorScheme = useColorScheme();

  return (
    <View style={{flex: 1}}>
      <ImageBackground source={require('../assets/images/headset.jpg')} style={{
        width: "100%",
        height: "100%",
        zIndex: -1,
        opacity: 1,
        position: 'absolute',
      }}/>
      
      <View style={{flex: 1}}>
        
        <BottomTab.Navigator
          tabBar={props => <CustomTabBar {...props}/> }
          initialRouteName="Login"
          screenOptions={{ // Opções globais
            headerTitleAlign: 'center',
            // headerTitleStyle: { color: 'red'},
            headerTitle: props => (
              <Image
              style={{ width: 120, height: 120 }}
              source={require('../assets/images/diva-logo.png')}
              />
            ), // SUBSTITUI OS Title das Screens
            headerStyle: {
              elevation: 0,
              // backgroundColor: 'orange'
            },
            // headerTransparent: true,
            tabBarIconStyle: { display: "none" },
            tabBarStyle: { // Não precisa do styleSheet
              bottom: 25,
              height: 70,
              alignItems: 'center',
              position: 'absolute',
              elevation: 0,
              borderTopWidth: 0,
              // backgroundColor: 'red'
              // backgroundColor: Colors[colorScheme].background
            },
            tabBarLabelStyle: {
              fontWeight: 'bold',
              fontSize: 16
            },
            tabBarActiveTintColor: Colors[colorScheme].tint,
          }}>
          <BottomTab.Screen
            name="Login"
            component={LoginScreen}
            options={({ navigation }: RootTabScreenProps<'Login'>) => ({
              title: 'LOGIN',
              tabBarButton: props => <CustomBarButton {...props} />
            })}
          />
          <BottomTab.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              title: 'REGISTRAR',
              tabBarButton: props => <CustomBarButton {...props} />
            }}
          />
        </BottomTab.Navigator>

      </View>
      
      
    </View>
  );
}

function HomeNavigator() {
  const colorScheme = useColorScheme();

  return (
    <View style={{flex: 1}}>
        <BottomTab.Navigator
          tabBar={props => <CustomTabBar {...props}/> }
          initialRouteName="Login"
          screenOptions={ ({navigation}) => ({
            headerTitleAlign: 'center',
            headerTitle: props => (
              <Image
              style={{ width: 120, height: 120 }}
              source={require('../assets/images/diva-logo.png')}
              />
            ),
            headerStyle: { elevation: 0 },
            tabBarActiveTintColor: Colors[colorScheme].tint,
            headerRight: () => {
              const { userInfo } = useContext(AuthContext)

              return (
                <Pressable
                  onPress={() => navigation.navigate('Modal')}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                  })}>
                    <Image source={{ uri: userInfo.imagem}} style={{
                      width: 45,
                      height: 45,
                      borderRadius: 50,
                      marginRight: 18
                    }}/>
                </Pressable>
              )
            }
          })}>
          <BottomTab.Screen
            name="Login"
            component={HomeScreen}
            options={({ navigation }: RootTabScreenProps<'Login'>) => ({
              title: 'HOME',
              tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            })}
          />
          <BottomTab.Screen
            name="Register"
            component={SearchScreen}
            options={{
              title: 'BUSCAR',
              tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
            }}
          />
          <BottomTab.Screen
            name="Playlist"
            component={PlaylistScreen}
            options={{
              title: 'PLAYLIST',
              // tabBarShowLabel: false,
              tabBarIcon: ({ color }) => <TabBarIcon name="play" color={color} />,
            }}
          />
        </BottomTab.Navigator>

    </View>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}