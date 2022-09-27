import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const App = () => {
  return (
    <View>
      <Text styles="container">App</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {justifyContent: 'center', alignContent: 'center'},
});
