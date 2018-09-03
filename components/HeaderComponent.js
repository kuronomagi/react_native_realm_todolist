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

import { deleteAllTodoLists } from '../databases/allSchemas';

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
        {hasAddButton && <TouchableOpacity style={styles.addButton} onPress={showAddTodoList}>
          <Image style={styles.addButtonImage} source={require('../images/add-icon.png')} />
        </TouchableOpacity>}

        {hasDeleteAllButton && <TouchableOpacity style={styles.deleteButton} onPress={
          () => {
            Alert.alert(
              'Delete all',
              'Are you sure you want to delete all todoLists?',
              [
                {
                  text: 'No', onPress: () => { }, // Do nothing
                  style: 'cancel'
                },
                {
                  text: 'Yes', onPress: () => {
                    deleteAllTodoLists().then().catch(error => {
                      alert(`Delete all TodoLists failed. Error = ${error}`);
                    });
                  }
                },
              ],
              { cancelable: true }
            );
          }
        }>
          <Image style={styles.deleteButtonImage} source={require('../images/delete-icon.png')} />
        </TouchableOpacity>}
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
  deleteButton: {
    zIndex: 2,
    marginRight: 10,
    marginTop: 30
  },
  addButtonImage: {
    width: 42,
    height: 42,
    tintColor: 'white'
  },
  deleteButtonImage: {
    width: 26,
    height: 26,
    tintColor: 'white'
  }
});