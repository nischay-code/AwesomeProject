import {StatusBar, StyleSheet, View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import ChatScreen from './screens/ChatScreen';
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import HomeScreen from './screens/HomeScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import AccountScreen from './screens/AccountScreen';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  version: 3,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2C6BED',
  },
};

const Stack = createStackNavigator();

const Navigation = () => {
  const [user, setuser] = useState('');
  useEffect(() => {
    const unregister = auth().onAuthStateChanged(userExist => {
      if (userExist) {
        setuser(userExist);
        firestore().collection('users').doc(userExist.uid).update({
          status: 'online',
        });
      } else {
        setuser('');
      }
    });
    return () => {
      unregister();
    };
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerTintColor: '#2C6BED'}}>
        {user ? (
          <>
            <Stack.Screen
              name="home"
              options={{
                title: 'ChatApp',
                // headerRight: () => (
                //   <MaterialIcons
                //     name="account-circle"
                //     size={34}
                //     color="#2C6BED"
                //     style={{marginRight: 10}}
                //     onPress={() => {
                //       firestore()
                //         .collection('users')
                //         .doc(user.uid)
                //         .update({
                //           status: firestore.FieldValue.serverTimestamp(),
                //         })
                //         .then(() => {
                //           auth().signOut();
                //         });
                //     }}
                //   />
                // ),
              }}>
              {props => <HomeScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
              name="chat"
              options={({route}) => ({
                title: (
                  <View>
                    <Text>{route.params.name}</Text>
                    <Text>{route.params.status}</Text>
                  </View>
                ),
              })}>
              {props => <ChatScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="account">
              {props => <AccountScreen {...props} user={user} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen
              name="login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="signup"
              component={SignupScreen}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor="#2C6BED" />
        <View style={styles.container}>
          <Navigation />
        </View>
      </PaperProvider>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
