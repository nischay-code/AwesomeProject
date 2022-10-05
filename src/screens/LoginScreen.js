/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {ActivityIndicator, TextInput, Button} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <ActivityIndicator size="large" color="#2C6BED" />;
  }

  const userLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      alert('Please Add All the Feild');
      return;
    }
    try {
      const result = await auth().signInWithEmailAndPassword(email, password);

      setLoading(false);
    } catch (error) {
      alert('something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView behavior="position">
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to ChatApp</Text>
        <Image style={styles.img} source={require('../assets/chatLogo.png')} />
      </View>
      <View style={styles.box2}>
        <TextInput
          label="Email"
          value={email}
          mode="outlined"
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          mode="outlined"
        />

        <Button mode="contained" onPress={() => userLogin()}>
          Login
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate('signup')}>
          <Text style={styles.press}>Don't have an Account ?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  text: {
    margin: 30,
    fontSize: 22,
    color: '#2C6BED',
  },
  img: {
    width: 200,
    height: 200,
  },
  container: {
    alignItems: 'center',
  },
  box2: {
    paddingHorizontal: 40,
    justifyContent: 'space-evenly',
    height: '50%',
  },
  press: {
    textAlign: 'center',
  },
});
