import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList
} from 'react-native';

import { updateTodoList, deleteTodoList, queryAllTodoLists, filterTodoLists, insertTodos2TodoList, getPlaylistsTrack } from '../databases/allSchemas';
import realm from '../databases/allSchemas';
import Swipeout from 'react-native-swipeout';

import HeaderComponent from './HeaderComponent';
import PopupDialogComponent from './PopupDialogComponents';

import TrackItemComponent from './TrackItemComponent';




class DetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>This is DetailScreen</Text>
        {console.log(navigation.state.params)}
        <TrackItemComponent />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#eee'
  },
  flatList: {
    flex: 1,
    flexDirection: 'column'
  },
  textInput: {
    padding: 15,
    borderStyle: 'solid',
    borderColor: '#000',
  }
});


export default DetailScreen;