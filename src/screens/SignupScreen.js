/* eslint-disable prettier/prettier */
/* eslint-disable curly */
/* eslint-disable prettier/prettier */
/* eslint-disable no-alert */
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
import {ActivityIndicator, Button, TextInput} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <ActivityIndicator size="large" color="#2C6BED" />;
  }

  const userSignup = async () => {
    setLoading(true);
    if (!email || !password || !image || !name) {
      alert('Please Add All the Feild');
      return;
    }
    try {
      const result = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      firestore().collection('users').doc(result.user.uid).set({
        name: name,
        email: result.user.email,
        uid: result.user.uid,
        pic: image,
        status: 'online',
      });
      setLoading(false);
    } catch (error) {
      alert('something went wrong');
    }
  };

  // const pickImageAndUpload = () => {
  //   launchImageLibrary({quality: 0.5}, fileobj => {
  //     const uploadTask = storage()
  //       .ref()
  //       .child(`/userprofile/${Date.now()}`)
  //       .putFile(fileobj.uri);
  //     uploadTask.on(
  //       'state_changed',
  //       snapshot => {
  //         var progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         if (progress === 100) alert('image uploaded');
  //       },
  //       error => {
  //         alert('Error');
  //       },
  //       () => {
  //         uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
  //           setImage(downloadURL);
  //         });
  //       },
  //     );
  //   });
  // };
  const pickImageAndUpload = () => {
    launchImageLibrary({quality: 0.5}, result => {
      if (result.errorCode || result.didCancel) {
        return console.log('You should handle errors or user cancellation!');
      }
      const img = result.assets[0];
      const uploadTask = storage()
        .ref()
        .child(`/userprofile/${Date.now()}`)
        .putFile(img.uri);

      uploadTask.on(
        'state_changed',
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress === 100) {
            alert('image uploaded');
          }
        },
        error => {
          alert('something went wrong');
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log(downloadURL);
            setImage(downloadURL);
          });
        },
      );
    });
  };

  return (
    <KeyboardAvoidingView behavior="position">
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to ChatApp</Text>
        <Image style={styles.img} source={require('../assets/chatLogo.png')} />
      </View>
      <View style={styles.box2}>
        {!showNext && (
          <>
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
          </>
        )}
        {showNext ? (
          <>
            <TextInput
              label="Name"
              value={name}
              mode="outlined"
              onChangeText={text => {
                setName(text);
              }}
            />
            <Button mode="contained" onPress={() => pickImageAndUpload()}>
              Select Profile Pic
            </Button>
            <Button
              mode="contained"
              disabled={image ? false : true}
              onPress={() => userSignup()}>
              Sign Up
            </Button>
          </>
        ) : (
          <Button mode="contained" onPress={() => setShowNext(true)}>
            Next
          </Button>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('login')}>
          <Text style={styles.press}>Already have an Account ?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

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
