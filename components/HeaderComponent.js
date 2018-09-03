import React, { Component } from "react";
import { 
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Alert
} from "react-native";

  const HeaderComponent = props => {
    const { title, showAddTodoList, hasAddButton,
      hasSortButton, sort, sortState, hasDeleteAllButton
    } = props;

    return (
      <View style={styles.container}>
        {
          /*
          Show this TouchableOpacity if hasAddButton == true

          hasAddButtonの場合はこのTouchableOpacityを表示
          */
        }
        <TouchableOpacity style={styles.hasAddButton} onPress={showAddTodoList}>
          <Image style={styles.addButtonImage} source={require('../images/add-icon.png')} />
        </TouchableOpacity>
      </View>
    );
  };

export default HeaderComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgb(224, 93, 144)',
    height: Platform.OS === 'ios' ? 100 : 80,
  },
  titleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    position: 'absolute',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    padding: 50
  },
  addButton: {
    zIndex: 2,
    marginRight: 10,
    marginTop: 30
  },
  addButtonImage: {
    width: 42,
    height: 42,
    tintColor: 'white'
  }
});