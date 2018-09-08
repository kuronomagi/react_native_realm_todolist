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

// Delete all TodoLists
import { deleteAllTodoLists } from '../databases/allSchemas';

// sort
import { SORT_ASCENEING, SORT_DESCENDING } from './sortStates';

  const HeaderComponent = props => {
    const { title, showAddPlayList, hasAddButton,
      hasSortButton, sort, sortState, hasDeleteAllButton
    } = props;

    let sortIcon = sortState === SORT_ASCENEING ?
      require('../images/sort-asc-icon.png'):
      require('../images/sort-desc-icon.png');

    return (
      <View style={styles.container}>
        {
          /*
          Show this TouchableOpacity if hasAddButton == true

          hasAddButtonの場合はこのTouchableOpacityを表示
          */
        }

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

        {hasSortButton && <TouchableOpacity style={styles.addButton} onPress={sort}>
          <Image style={styles.sortButtonImage} source={sortIcon}/>
        </TouchableOpacity>}

        {hasAddButton && <TouchableOpacity style={styles.addButton} onPress={showAddPlayList}>
          <Image style={styles.addButtonImage} source={require('../images/add-icon.png')} />
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
    backgroundColor: '#ddd',
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