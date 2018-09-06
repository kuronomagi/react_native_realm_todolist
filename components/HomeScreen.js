import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Image,
  StatusBar
} from 'react-native';
import {
  createBottomTabNavigator,
  createStackNavigator,
  TabBarBottom
 } from 'react-navigation';


import TodoListComponent from './TodoListComponent';
// import TodoListDetailComponent from './DetailScreen';

import TrackItemComponent from './TrackItemComponent';



class HomeScreen extends React.Component {

  render() {
    const headerNavigationOptions = {
      headerStyle: {
        backgroundColor: '#FFF',
        marginTop: (Platform.OS === 'android' ? 24 : 0),
        shadowOpacity: 0,
        elevation: 0,
        shadowColor : '#5bc4ff',
        zIndex: 1,
      },
      headerTitleStyle: {
        color: '#313131',
        fontSize: 14,
      },
      headerTintColor: '#A7A7A7',
    };

    const TodoListStack = createStackNavigator({
      todolist_screen: {
        screen: TodoListComponent,
        navigationOptions: {
          ...headerNavigationOptions,

          headerTitle: 'プレイリスト一覧',
          headerBackTitle: null,
          headerStyle:{
            backgroundColor: '#FFF',
            borderBottomWidth: 0,
          },
          },
        },
        todolist_detail_screen: {
          screen: TrackItemComponent,
          navigationOptions: {
            ...headerNavigationOptions,
            headerTitle: 'プレイ詳細リスト一覧',
          },
        },
      },
    );


    return (
      <View style={styles.container}>
        <TodoListStack />
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
});

export default HomeScreen;