/* eslint-disable prettier/prettier */

import {
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {FAB} from 'react-native-paper';

const HomeScreen = ({user, navigation}) => {
  // console.log(user);
  const [users, setUsers] = useState(null);
  const getUsers = async () => {
    const querySnap = await firestore()
      .collection('users')
      .where('uid', '!=', user.uid)
      .get();
    const allusers = querySnap.docs.map(docSnap => docSnap.data());
    // console.log(allusers);
    setUsers(allusers);
  };
  useEffect(() => {
    getUsers();
  });

  const RenderCard = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('chat', {
            name: item.name,
            uid: item.uid,
            status:
              typeof item.status === 'string'
                ? item.status
                : item.status.toDate().toString(),
          })
        }>
        <View style={styles.card}>
          <Image source={{uri: item.pic}} style={styles.img} />
          <View>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>{item.email}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={users}
        renderItem={({item}) => {
          return <RenderCard item={item} keyExtractor={item => item.uid} />;
        }}
      />
      <FAB
        icon="face-man-profile"
        style={styles.fab}
        onPress={() => navigation.navigate('account')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2C6BED',
  },
  text: {
    fontSize: 18,
    marginLeft: 15,
  },
  card: {
    flexDirection: 'row',
    margin: 3,
    padding: 4,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
});

export default HomeScreen;
