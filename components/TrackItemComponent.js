import React, {Component} from 'react';
import {FlatList, TouchableOpacity, Alert ,Platform, StyleSheet, Text, View, TextInput} from 'react-native';
import { updatePlayListTitle, queryAllPlayLists, filterPlayLists, insertTodos2TodoList, getPlaylistsTrack,
  insertNewTrack, queryCategoriesFramuAlbum, deleteTrackItem, insertPlayListState } from '../databases/allSchemas';
import realm from '../databases/allSchemas';
import Swipeout from 'react-native-swipeout';

import HeaderComponent from './HeaderComponent';
import PopupDialogComponent from './PopupDialogComponents';


let FlatListItem = props => {
  const { itemIndex, id, name, title, popupDialogComponent, onPressItem, albumTitle, artist, albumArtUrl, audioUrl, playlistDetailId, song_id } = props;
  // console.log('#### ここから props ####')
  // console.log(props);
  showEditModal = () => {
    popupDialogComponent.showDialogComponentForUpdate({
      id, name, title, playlist_title, albumTitle, artist, albumArtUrl, audioUrl, playlistDetailId, song_id
    });
  }
  showDeleteConfirmation = () => {
    deleteTrackItem(id).then().catch(error => {
      alert(`Failed to delete todoList with id = ${id}, error=${error}`);
    });
  }

  return (
    <Swipeout
      right={[
        {
          text: 'Delete',
          backgroundColor: '#F00',
          onPress: showDeleteConfirmation
        }
      ]} autoClose={true}>
        <TouchableOpacity onPress={onPressItem}>
          <View style={{ backgroundColor: itemIndex % 2 == 0 ? '#eee' : '#FFF' }} >
            <Text style={{ color: 'black',fontWeight: 'bold', fontSize: 18, margin: 10 }}>{props[0].song_id}</Text>
            <Text style={{ color: 'black',fontWeight: 'bold', fontSize: 14, margin: 10 }}>{props[0].title}</Text>
          </View>
        </TouchableOpacity>
    </Swipeout>
  );
}

export default class TrackItemComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playList: [],
      searchedName: ''
    };
    console.log('======== ここから ========')
    console.log(
      insertPlayListState(this.props.navigation.state.params).then().catch((error) => {
        alert(`TarckPreference error ${error}`);
      })
    );

    this.reloadData();
    realm.addListener('change', () => {
      // Run this if 'realm' DB changed  'realm' DBが変更された場合はこれを実行してください
      this.reloadData();
    });
  }

  reloadData = () => {

    // react-navigateで第二引数をもってきている
    let playlistDetailId = this.props.navigation.state.params;
    {console.log(playlistDetailId)}

    insertPressItem = (playlistDetailId) => {
      // insertTrackItem(playlistDetailId).then().catch((error) => {
      //   alert(`IinsertPressItem error ${error}`);
      // });
    }

    insertPlayListState(this.props.navigation.state.params).then((songDate) => {

      this.setState({ playList: songDate });
      // console.log('======== ここから this.state.playList ========')
      // console.log(this.state.playList);

    }).catch((error) => {
      this.setState({ playList: [] });
    });
  }

  render() {

    return (
      <View style={styles.container}>
        <Text>Trackのコンポネ</Text>
        {console.log('run')}
        {console.log(this.state.playList)}
        <FlatList
          style={styles.flatList}

          // Save this array to 'state'
          data={this.state.playList}
          renderItem={({item, index}) => <FlatListItem {...item} itemIndex={index}
          popupDialogComponent={this.refs.popupDialogComponent}

          onPressItem={() => {
            getPlaylistsTrack(item.id).then(() => {
              console.log('描画');
            }).catch(error => {
              alert(`読み取れませんでした。 Error: ${JSON.stringify(error)}`)
            });
          }}

          />}
          keyExtractor={item => item.id}
        />

        <TouchableOpacity
          onPress={() => {
            queryCategoriesFramuAlbum(this.props.navigation.state.params).then((songList) => {
              console.log('queryCategoriesFramuAlbum 成功');
            }).catch(error => {
              console.log('queryCategoriesFramuAlbum 失敗');
              console.log(error);
            })
          }}>
          <Text>INSET BUTTON</Text>
        </TouchableOpacity>

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
    flexDirection: 'column',
    backgroundColor: 'skyblue'
  },
  textInput: {
    padding: 15,
    borderStyle: 'solid',
    borderColor: '#000',
    backgroundColor: 'pink'
  }
});