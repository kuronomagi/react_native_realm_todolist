import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  TextInput
} from "react-native";
import PopupDialog, { SlideAnimation, DialogTitle } from 'react-native-popup-dialog';

// Database
import { insertNewPlayList, updatePlayListTitle } from '../databases/allSchemas';

class PopupDialogComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist_id: 0,
      playlist_title: '',
      title: '',
      isAddNew: true
    };
  }

  // Show dialog when update
  showDialogComponentForUpdate = (existingTodoList) => {
    console.log("プレイリスト名を編集 existingTodoList");
    console.log(existingTodoList);
    this.refs.popupDialog.show();
    this.setState({
      dialogTitle: 'プレイリスト名を編集',
      playlist_id: existingTodoList.playlist_id,
      title: '',
      playlist_title: existingTodoList.playlist_title,
      isAddNew: false
    });
  }

  // Show dialog when add new 'playList
  showDialogComponentForAdd = () => {
    this.refs.popupDialog.show();

    // Clear data before insertiong  挿入前のデータを消去
    this.setState({
      dialogTitle: '新しいリストを追加します',
      playlist_title: '',
      title: '',
      isAddNew: true
    });
  }

  render() {
    const { dialogTitle } = this.state;
    return (
      <PopupDialog
        dialogTitle={<DialogTitle title={dialogTitle} />}
        width={0.7} height={180}
        ref={'popupDialog'}
      >
          <View style={styles.container}>
            <TextInput
              style={styles.textInput}
              placeholder={'Enter TodoList name'}
              autoCorrecrt={false}
              onChangeText={(text) => {
                this.setState({ playlist_title: text });
              }}
              value={this.state.playlist_title}
            />

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (this.state.playlist_title.trim() == ''){
                    alert('Please enter playList name');
                    return;
                  }

                  this.refs.popupDialog.dismiss(() => {
                    if (this.state.isAddNew == true) {
                      const insertPlayListItem = {
                        playlist_id: Math.floor(Date.now() /1000),
                        type: 'string',
                        playlist_title: this.state.playlist_title,
                        created_at: new Date(),
                        update_at: new Date(),
                      };

                      insertNewPlayList(insertPlayListItem).then().catch((error) => {
                        alert(`Insert new playList error ${error}`);
                      });
                    } else {
                      const playLists = {
                        playlist_id: this.state.playlist_id,
                        playlist_title: this.state.playlist_title,
                        update_at: new Date(),
                      };

                      updatePlayListTitle(playLists).then().catch((error) => {
                        alert(`Update playList error ${error}`);
                      });
                    }
                  });
                }}>
                <Text style={styles.textLabel}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.refs.popupDialog.dismiss(() => {
                    console.log('Called Cancel, dismiss popup');
                  });
                }}
              >
                <Text style={styles.textLabel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
      </PopupDialog>
    );
  }
}
export default PopupDialogComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  TextInput: {
    height: 40,
    padding: 10,
    margin: 10,
    borderColor: 'gray',
    borderWidth: 1
  },
  button: {
    backgroundColor: 'steelblue',
    padding: 10,
    margin: 10
  },
  textLabel: {
    color: 'white',
    fontSize: 18
  }
});