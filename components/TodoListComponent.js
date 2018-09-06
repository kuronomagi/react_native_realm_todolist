import React, {Component} from 'react';
import {FlatList, TouchableOpacity, Alert ,Platform, StyleSheet, Text, View, TextInput} from 'react-native';
import { updateTodoList, deletePlayList, queryAllTodoLists, filterTodoLists, insertTodos2TodoList, getPlaylistsTrack,
  insertNewTrack } from '../databases/allSchemas';
import realm from '../databases/allSchemas';
import Swipeout from 'react-native-swipeout';

import HeaderComponent from './HeaderComponent';
import PopupDialogComponent from './PopupDialogComponents';
import { SORT_ASCENDING, SORT_DESCENDING } from './sortStates';


// const newTrack = {
//   id: Math.floor(Date.now() /1000),
//   type: 'string',
//   title: 'Good Goocbye',
//   artist: 'ONE OK ROCK',
//   albumTitle: 'test',
//   albumArtUrl: new Date(),
//   audioUrl: new Date()
// };

// insertNewTrack(newTrack).then().catch((error) => {
//   alert(`Insert new todoList error ${error}`);
// });


let FlatListItem = props => {
  const { itemIndex, id, name, title, creationDate, popupDialogComponent, onPressItem } = props;
  showEditModal = () => {
    popupDialogComponent.showDialogComponentForUpdate({
      id, name, title
    });
  }
  showDeleteConfirmation = () => {
    Alert.alert(
      'Delete',
      'Delete a todoList',
      [
        {
          text: 'No', onPress: () => { }, // Do nothing
          style: 'cancel'
        },
        {
          text: 'Yes', onPress: () => {
            deletePlayList(id).then().catch(error => {
              alert(`Failed to delete todoList with id = ${id}, error=${error}`);
            });
          }
        },
      ]
    )
  }
  return (
    <Swipeout
      right={[
        {
          text: 'Edit',
          backgroundColor: '#ddd',
          onPress: showEditModal
        },
        {
          text: 'Delete',
          backgroundColor: '#F00',
          onPress: showDeleteConfirmation
        }
      ]} autoClose={true}>
        <TouchableOpacity onPress={onPressItem}>
          <View style={{ backgroundColor: itemIndex % 2 == 0 ? '#FFF' : '#FFF' }} >
            <Text style={{ fontWeight: 'bold', fontSize: 18, margin: 10 }}>{name}</Text>
            <Text style={{fontSize: 18, margin: 10}} numberOfLines={2}>{creationDate.toLocaleString()}</Text>
          </View>
        </TouchableOpacity>
    </Swipeout>
  );
}

export default class TodoListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortStates: SORT_ASCENDING,
      todoLists: [],
      searchedName: ''
    };

    this.reloadData();
    realm.addListener('change', () => {
      // Run this if 'realm' DB changed  'realm' DBが変更された場合はこれを実行してください
      this.reloadData();
    });
  }

  sort = () => {
    this.setState({
      sortState: this.state.sortState === SORT_ASCENDING ? SORT_DESCENDING : SORT_ASCENDING,
      todoLists: this.state.todoLists.sorted('creationDate', this.state.sortState === SORT_DESCENDING ? true: false)
    });
  }

  reloadData = () => {
    queryAllTodoLists().then((todoLists) => {
      this.setState({ todoLists: todoLists });
    }).catch((error) => {
      this.setState({ todoList: [] });
    });
    console.log('reloadData');
  }

  render() {
    console.log(realm.path);
    return (
      <View style={styles.container}>
        <HeaderComponent
          title={'Todo List'}
          hasAddButton={true}
          hasDeleteAllButton={true}
          showAddTodoList={
            () => {
              this.refs.popupDialogComponent.showDialogComponentForAdd();
            }
          }
          hasSortButton={true}
          sort={this.sort}
          sortState={this.state.sortState}
        />
        <TextInput
          style={styles.textInput}
          placeholder='検索ワードを入力'
          autoCorrect={false}
          onChangeText={(text) => {
            this.setState({ searchedName: text });
            filterTodoLists(text).then(filterTodoLists => {
              this.setState({ todoLists: filterTodoLists });
            }).catch(error => {
              this.setState({ todoLists: [] });
            });
          }}
          value={this.state.searchedName}
        />
        <FlatList
          style={styles.flatList}

          // Save this array to 'state'
          data={this.state.todoLists}
          renderItem={({item, index}) => <FlatListItem {...item} itemIndex={index}
          popupDialogComponent={this.refs.popupDialogComponent}
          onPressItem={() => {

            getPlaylistsTrack(item.id).then(() => {

              // 画面推移
              this.props.navigation.navigate('todolist_detail_screen', item.id)


              // 詳細ページでの照会につかう関数
              // alert(`成功: ${JSON.stringify(item.id)}`);

            }).catch(error => {
              alert(`読み取れませんでした。 Error: ${JSON.stringify(error)}`)
            });

          }} />}
          keyExtractor={item => item.id}
        />
        <PopupDialogComponent ref={'popupDialogComponent'} />
      </View>
    );
  };
};

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