import React, {Component} from 'react';
import {FlatList, TouchableOpacity, Alert ,Platform, StyleSheet, Text, View, TextInput, NativeModules} from 'react-native';
import { updateTodoList, deletePlayList, queryAllPlayLists, filterPlayLists, insertTodos2TodoList, getPlaylistsTrack,
  insertNewTrack, saveNewSong, SongSchema } from '../databases/allSchemas';
import realm from '../databases/allSchemas';
import Swipeout from 'react-native-swipeout';

import HeaderComponent from './HeaderComponent';
import PopupDialogComponent from './PopupDialogComponents';
import { SORT_ASCENDING, SORT_DESCENDING } from './sortStates';


// file accses

// InsertFetchAlbum
import RNFetchBlob from 'react-native-fetch-blob';

console.log(realm.path);
//-------------　InsertFetchAlbum ここから --------------
RNFetchBlob
  .config({
    fileCache : false,
    // by adding this option, the temp files will have a file extension
    appendExt : 'mp3' // 拡張しを変えたいとき
  })
  .fetch('GET','https://github.com/kuronomagi/react-native-video-test/raw/master/music/artist_1/001/001.mp3', {
    // some headers ..
  })
  .then((res) => {
    console.log('fetch run');
    // the temp file path with file extension `png`
    console.log('ファイルを保存しました。 ', res.path());

    NativeModules.Mp3GetAll.getFile();
    NativeModules.Mp3GetAll.viewDidLoad();
    NativeModules.Mp3GetAll.didReceiveMemoryWarning();
  })
//-------------　InsertFetchAlbum ここまで -------------


let FlatListItem = props => {
  const { itemIndex, id, title, playlist_title, creationDate, popupDialogComponent, onPressItem } = props;
  showEditModal = () => {
    popupDialogComponent.showDialogComponentForUpdate({
      id, title, playlist_title
    });
  }
  showDeleteConfirmation = () => {
    Alert.alert(
      'Delete',
      'Delete a playList',
      [
        {
          text: 'No', onPress: () => { }, // Do nothing
          style: 'cancel'
        },
        {
          text: 'Yes', onPress: () => {
            deletePlayList(id).then().catch(error => {
              alert(`Failed to delete playList with id = ${id}, error=${error}`);
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
            <Text style={{ fontWeight: 'bold', fontSize: 18, margin: 10 }}>{playlist_title}</Text>
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
      playLists: [],
      searchedName: ''
    };

    this.reloadData();
    realm.addListener('change', () => {
      // Run this if 'realm' DB changed  'realm' DBが変更された場合はこれを実行してください
      this.reloadData();
    });
  }

  componentWillMount() {
    this._fetch();
  }

  // _fetch = () => {
  //   RNFetchBlob
  //   .config({
  //     fileCache : false,
  //   })
  //   .fetch('GET','https://github.com/kuronomagi/react-native-video-test/raw/master/music/alubum.json', {
  //   })
  //   .then((res) => {
  //     console.log('fetch run');
  //   })
  // }

  _fetch = () => {
    console.log('jsonにアクセス');
    fetch('https://github.com/kuronomagi/react-native-video-test/raw/master/music/alubum.json')
      .then((response) => response.json())
      .then((responseJson) => {
        let albumData = responseJson;
        console.log(albumData);
        console.log(new Date());

        console.log(albumData[0].song);

        const TarckPreference = {
          id: Math.floor(Date.now() /1000),
          song_id: albumData[0].song_id, // 曲ID
          song: albumData[0].song,
          title: albumData[0].title, // 曲名
          title_sort: albumData[0].title_sort, // 曲名（ソート）
          album: albumData[0].album, // アルバム名
          album_sort: albumData[0].album_sort, // アルバム名（ソート）
          album_artist: albumData[0].artist, // アルバムアーティスト
          album_artist_sort: albumData[0].artist_sort, // アルバムアーティスト（ソート）
          artist: albumData[0].artist, // アーティスト名
          artist_sort: albumData[0].artist_sort, // アーティスト名（ソート）
          composer: albumData[0].composer, // 作曲者
          composer_sort: albumData[0].composer_sort, // 作曲者（ソート）
          genre: albumData[0].genre, // ジャンル
          release_year: albumData[0].release_year,
          last_add_at: new Date(), // 最後に追加した日
          last_play_at: new Date(), // 最後に再生した日
          primary_artwork: albumData[0].primary_artwork,
          secondary_artwork: albumData[0].secondary_artwork,
        };

        saveNewSong(TarckPreference).then(console.log('成功')).catch((error) => {
          alert(`TarckPreference error ${error}`);
        });


      })
      .catch((error) => {
        console.error(error);
      });
  }

  sort = () => {
    this.setState({
      sortState: this.state.sortState === SORT_ASCENDING ? SORT_DESCENDING : SORT_ASCENDING,
      playLists: this.state.playLists.sorted('creationDate', this.state.sortState === SORT_DESCENDING ? true: false)
    });
  }

  reloadData = () => {
    queryAllPlayLists().then((playLists) => {
      this.setState({ playLists: playLists });
    }).catch((error) => {
      this.setState({ playList: [] });
    });
    console.log('reloadData');
  }

  render() {
    console.log(realm.path);
    return (
      <View style={styles.container}>
        <HeaderComponent
          title={'TPlay List'}
          hasAddButton={true}
          hasDeleteAllButton={true}
          showAddPlayList={
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
            filterPlayLists(text).then(filterPlayLists => {
              this.setState({ playLists: filterPlayLists });
            }).catch(error => {
              this.setState({ playLists: [] });
            });
          }}
          value={this.state.searchedName}
        />
        <TouchableOpacity
          onPress={() => NativeModules.Mp3GetAll.getFile()}
        >
        <Text>BUTTON</Text>
        </TouchableOpacity>
        <FlatList
          style={styles.flatList}

          // Save this array to 'state'
          data={this.state.playLists}
          renderItem={({item, index}) => <FlatListItem {...item} itemIndex={index}
          popupDialogComponent={this.refs.popupDialogComponent}
          onPressItem={() => {

            getPlaylistsTrack(item.id).then(() => {

              // 画面推移
              this.props.navigation.navigate('todolist_detail_screen', item.id)

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