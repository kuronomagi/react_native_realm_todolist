import React, {Component} from 'react';
import {FlatList, TouchableOpacity, Alert ,Platform, StyleSheet, Text, View, TextInput} from 'react-native';
import { updateTodoList, deletePlayList, queryAllTodoLists, filterTodoLists, insertTodos2TodoList, getPlaylistsTrack,
  insertNewTrack } from '../databases/allSchemas';
import realm from '../databases/allSchemas';
import Swipeout from 'react-native-swipeout';

import HeaderComponent from './HeaderComponent';
import PopupDialogComponent from './PopupDialogComponents';
import { SORT_ASCENDING, SORT_DESCENDING } from './sortStates';


// file accses
import { MainBundlePath, DocumentDirectoryPath } from 'react-native-fs';

// InsertFetchAlbum
import RNFetchBlob from 'react-native-fetch-blob';

// // Zip Archive
// import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive';

//-------------　InsertFetchAlbum ここから --------------
RNFetchBlob
  .config({
    fileCache : false,
    // by adding this option, the temp files will have a file extension
    appendExt : 'zip' // 拡張しを変えたいとき
  })
  .fetch('GET', 'https://github.com/kuronomagi/react-native-video-test/raw/master/music/example.zip', {
    // some headers ..
  })
  .then((res) => {
    console.log('fetch run');
    // the temp file path with file extension `png`
    console.log('ファイルを保存しました。 ', res.path());

    // const zipPath = res.path();
    // const ZipName = zipPath.split('/').filter(e => Boolean(e));
    // console.log(ZipName);
    // const resultZipName = ZipName[ZipName.length - 1];
    // console.log(resultZipName);
    // // Beware that when using a file path as Image source on Android,
    // // you must prepend "file://"" before the file path
    // // imageView = <Image source={{ uri : Platform.OS === 'android' ? 'file://' + res.path()  : '' + res.path() }}/>


    // unZip
    // const assetPath = `${DocumentDirectoryPath}/RNFetchBlob_tmp/${resultZipName}`;
    // const targetPath = `${DocumentDirectoryPath}/audio`;
    // console.log('unzipAssets before');
    // console.log(DocumentDirectoryPath);
    // unzipAssets(assetPath, targetPath)
    // .then((path) => {
    //   console.log(`解答が完了しました。保存先は ${path}です`);
    // })
    // .catch((error) => {
    //   console.log(`解答に失敗しました。エラー詳細：${error}`);
    // })
  })
//-------------　InsertFetchAlbum ここまで --------------






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