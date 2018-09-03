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
import { insertNewTodoList, updateTodoList } from '../databases/allSchemas';

class PopupDialogComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: '',
      isAddNew: true
    };
  }

  showDialogComponentForAdd = () => {
    this.refs.popupDialog.show();

    // Clear data before insertiong  挿入前のデータを消去
    this.setState({
      dialogTitle: 'Add a new TodoList',
      name: '',
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
              onChangeText={(text) => this.setState({ name: text })} value={this.state.name}
            />

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (this.state.name.trim() == ''){
                    alert('Please enter todoList name');
                    return;
                  }

                  this.refs.popupDialog.dismiss(() => {
                    if (this.state.isAddNew == true) {
                      const newTodoList = {
                        id: Math.floor(Date.now() /1000),
                        name: this.state.name,
                        creationDate: new Date()
                      };

                      insertNewTodoList(newTodoList).then().catch((error) => {
                        alert(`Insert new todoList error ${error}`);
                      });
                    } else {

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