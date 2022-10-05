/* eslint-disable prettier/prettier */
import {View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {GiftedChat, Bubble, InputToolbar} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';

const ChatScreen = ({user, route}) => {
  const [messages, setMessages] = useState([]);
  const {uid} = route.params;
  const getAllMessages = async () => {
    const docid = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
    const querySnap = await firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .get();
    const allmsg = querySnap.docs.map(docSnap => {
      return {
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
      };
    });
    setMessages(allmsg);
  };

  useEffect(() => {
    // getAllMessages();
    const docid = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
    const messageRef = firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc');
    const unSubscribe = messageRef.onSnapshot(querySnap => {
      const allmsg = querySnap.docs.map(docSnap => {
        const data = docSnap.data();
        if (data.createdAt) {
          return {
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSnap.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allmsg);
    });
    return () => {
      unSubscribe();
    };
  });
  const onSend = messageArray => {
    const msg = messageArray[0];
    const mymsg = {
      ...msg,
      sentBy: user.uid,
      sentTo: uid,
      createdAt: new Date(),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
    const docid = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .add({...mymsg, createdAt: firestore.FieldValue.serverTimestamp()});
  };
  return (
    <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: user.uid,
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: '#2C6BED',
                },
                // left: {
                //   backgroundColor: 'light-grey',
                // },
              }}
            />
          );
        }}
        renderInputToolbar={props => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{borderTopWidth: 1, borderTopColor: '#2C6BED'}}
            />
          );
        }}
      />
    </View>
  );
};

export default ChatScreen;
