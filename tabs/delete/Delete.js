import React, { Component } from 'react';
import { Text, Image, View, StyleSheet } from 'react-native';

class DeleteView extends Component {
    render() {
      return (
        <View
          style={styles.style}>
          <Text>此页功能尚未完善</Text>
        </View>
      );
    }
  }

  export default DeleteView

const styles = StyleSheet.create ({
    style: {
        flexDirection: 'row',
        height: 100,
        padding: 20,
   }
})